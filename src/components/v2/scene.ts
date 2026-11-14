/**
 * Three.js scene for /v2: a volleyball in brand colours that travels through
 * the page as you scroll (hero → values → podium → finale).
 *
 * Labels that stick to the model (technique from the reference reel):
 *   1. an empty Object3D marks each point on the ball,
 *   2. getWorldPosition() + project(camera) gives its screen position,
 *   3. that is converted to pixels and an HTML pill is placed beside the ball,
 *   4. an SVG line joins the pill and the point.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface Pose {
  x: number;
  y: number;
  scale: number;
  /** 0 → free spin, 1 → gentle sway facing the camera (labels mode). */
  values: number;
  /** Podium visibility 0..1. */
  podium: number;
  /** Side pedestals visibility 0..1. */
  sides: number;
}

const BRAND = "#1f52d8";
const SUN = "#ffc531";

/** Directions (on the unit sphere) where the six value labels point. */
const ANCHOR_DIRS: [number, number, number][] = [
  [-0.62, 0.62, 0.48],
  [-0.92, 0.05, 0.4],
  [-0.6, -0.62, 0.5],
  [0.62, 0.6, 0.5],
  [0.94, -0.02, 0.36],
  [0.58, -0.64, 0.5],
];

/** Draws one ball panel: three strips with stitched seams, like a real volleyball. */
function panelTexture(index: number) {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const colours = index % 2 === 0 ? [SUN, "#f5f7fc", BRAND] : [BRAND, "#f5f7fc", SUN];
  const vertical = index < 4; // ±x and ±y faces: vertical strips; ±z: horizontal → neighbours cross like a real ball
  const w = size / 3;
  colours.forEach((col, i) => {
    g.fillStyle = col;
    if (vertical) g.fillRect(i * w, 0, w + 1, size);
    else g.fillRect(0, i * w, size, w + 1);
  });
  // soft leather grain
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,255" : "12,26,63"},${Math.random() * 0.05})`;
    g.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  // seams between strips and around the panel
  g.strokeStyle = "rgba(12,26,63,0.55)";
  g.lineWidth = 7;
  for (let i = 1; i < 3; i++) {
    g.beginPath();
    if (vertical) {
      g.moveTo(i * w, 0);
      g.lineTo(i * w, size);
    } else {
      g.moveTo(0, i * w);
      g.lineTo(size, i * w);
    }
    g.stroke();
  }
  g.lineWidth = 10;
  g.strokeRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Radial "pool of light" for the podium floor. */
function lightPoolTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(140,175,255,0.55)");
  grd.addColorStop(0.5, "rgba(60,100,220,0.18)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export class ActScene {
  readonly anchors: THREE.Object3D[] = [];
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private ball = new THREE.Group();
  private ballMesh: THREE.Mesh;
  private podium = new THREE.Group();
  private sidePedestals: THREE.Mesh[] = [];
  private fadeMats: { mat: THREE.Material & { opacity: number }; base: number; side: boolean }[] = [];
  private spot: THREE.SpotLight;
  private spinAngle = 0;
  private time = 0;
  private fit = 1;
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private tmp3 = new THREE.Vector3();

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.camera.position.set(0, 0, 7);

    // Ball: a subdivided cube pushed out to a sphere keeps one UV square per face → 6 panels.
    const geo = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      this.tmp.fromBufferAttribute(pos, i).normalize();
      pos.setXYZ(i, this.tmp.x, this.tmp.y, this.tmp.z);
    }
    geo.computeVertexNormals();
    const mats = Array.from(
      { length: 6 },
      (_, i) =>
        new THREE.MeshPhysicalMaterial({
          map: panelTexture(i),
          roughness: 0.48,
          clearcoat: 0.45,
          clearcoatRoughness: 0.35,
          envMapIntensity: 0.75,
        }),
    );
    this.ballMesh = new THREE.Mesh(geo, mats);
    this.ballMesh.rotation.set(0.5, 0.3, 0.1);
    this.ball.add(this.ballMesh);

    for (const d of ANCHOR_DIRS) {
      const a = new THREE.Object3D();
      a.position.set(...d).normalize();
      this.ball.add(a);
      this.anchors.push(a);
    }
    this.scene.add(this.ball);

    // Podium: three pedestals for the top three teams.
    const pedMat = () => {
      const m = new THREE.MeshStandardMaterial({ color: "#1a2650", roughness: 0.55, metalness: 0.15, transparent: true, opacity: 0 });
      return m;
    };
    const specs: { x: number; h: number; side: boolean }[] = [
      { x: -1.35, h: 0.65, side: true },
      { x: 0, h: 1.0, side: false },
      { x: 1.35, h: 0.45, side: true },
    ];
    const baseY = -1.7;
    for (const s of specs) {
      const m = pedMat();
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, s.h, 64), m);
      ped.position.set(s.x, baseY + s.h / 2, 0);
      this.podium.add(ped);
      this.fadeMats.push({ mat: m, base: 1, side: s.side });
      if (s.side) this.sidePedestals.push(ped);
      // bright rim on top edge
      const rimMat = new THREE.MeshBasicMaterial({ color: "#8fb3ff", transparent: true, opacity: 0 });
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.008, 8, 96), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(s.x, baseY + s.h, 0);
      this.podium.add(rim);
      this.fadeMats.push({ mat: rimMat, base: 0.7, side: s.side });
    }
    const poolMat = new THREE.MeshBasicMaterial({ map: lightPoolTexture(), transparent: true, opacity: 0, depthWrite: false });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = baseY + 0.001;
    this.podium.add(pool);
    this.fadeMats.push({ mat: poolMat, base: 1, side: false });
    this.scene.add(this.podium);

    // Lights
    this.scene.add(new THREE.HemisphereLight("#dbe7ff", "#0c1a3f", 0.6));
    const key = new THREE.DirectionalLight("#ffffff", 2.2);
    key.position.set(3, 4, 5);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight("#5a8cfa", 3);
    rim.position.set(-4, 1, -3);
    this.scene.add(rim);
    this.spot = new THREE.SpotLight("#cfe0ff", 0, 12, Math.PI / 7, 0.5, 1.2);
    this.spot.position.set(0, 5, 2);
    this.spot.target.position.set(0, -1, 0);
    this.scene.add(this.spot, this.spot.target);
  }

  setSize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    // Shrink everything a little on portrait screens so it fits.
    this.fit = THREE.MathUtils.clamp(this.camera.aspect / 1.5, 0.52, 1);
  }

  /** Applies a pose (already interpolated from the scroll position) and renders a frame. */
  render(p: Pose, dt: number, reduceMotion: boolean) {
    this.time += dt;
    const spinSpeed = reduceMotion ? 0 : 0.45;
    this.spinAngle = Math.atan2(Math.sin(this.spinAngle + dt * spinSpeed * (1 - p.values)), Math.cos(this.spinAngle + dt * spinSpeed * (1 - p.values)));
    const sway = reduceMotion ? 0 : Math.sin(this.time * 0.55) * 0.28;
    this.ball.rotation.y = this.spinAngle * (1 - p.values) + sway * p.values;
    this.ball.rotation.x = reduceMotion ? 0 : Math.sin(this.time * 0.4) * 0.06;

    const s = p.scale * this.fit;
    this.ball.scale.setScalar(s);
    const float = reduceMotion ? 0 : Math.sin(this.time * 1.1) * 0.05 * (1 - p.podium);
    this.podium.scale.setScalar(this.fit);
    this.podium.position.y = (1 - this.fit) * 0.6;
    // On the podium the ball sits exactly on top of the centre pedestal (top at y = -0.7 before scaling).
    const onPodiumY = -0.7 * this.fit + this.podium.position.y + s;
    const freeY = p.y * (this.fit < 1 ? 0.9 : 1) + float;
    this.ball.position.set(p.x * this.fit, THREE.MathUtils.lerp(freeY, onPodiumY, p.podium), 0);
    this.podium.visible = p.podium > 0.01;
    for (const f of this.fadeMats) {
      f.mat.opacity = f.base * p.podium * (f.side ? p.sides : 1);
      // Fully transparent parts must not draw at all, or they still block what's behind them.
      f.mat.visible = f.mat.opacity > 0.005;
    }
    this.sidePedestals.forEach((m) => (m.visible = p.sides > 0.01));
    this.spot.intensity = 40 * p.podium;

    this.renderer.render(this.scene, this.camera);
  }

  /** Screen position (px) of an anchor and how much it faces the camera (−1..1). */
  project(anchor: THREE.Object3D, w: number, h: number) {
    const world = anchor.getWorldPosition(this.tmp);
    const normal = this.tmp2.copy(world).sub(this.ball.position).normalize();
    const toCamera = this.tmp3.copy(this.camera.position).sub(world).normalize();
    const facing = normal.dot(toCamera);
    world.project(this.camera);
    return { x: ((world.x + 1) / 2) * w, y: ((1 - world.y) / 2) * h, facing };
  }

  /** Ball centre and on-screen radius (px) — used to place the pills beside it. */
  ballScreen(w: number, h: number) {
    const c = this.tmp.copy(this.ball.position).project(this.camera);
    const cx = ((c.x + 1) / 2) * w;
    const cy = ((1 - c.y) / 2) * h;
    const edge = this.tmp2.copy(this.ball.position).add(this.tmp3.set(this.ball.scale.x, 0, 0)).project(this.camera);
    return { cx, cy, r: Math.abs(((edge.x + 1) / 2) * w - cx) };
  }

  dispose() {
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach((m) => {
          (m as THREE.MeshStandardMaterial).map?.dispose();
          m.dispose();
        });
      }
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }
}
