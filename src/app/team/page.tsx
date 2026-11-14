import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight, Info, UserRound } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/ui/Photo";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TwoPaths } from "@/components/sections/TwoPaths";
import { getTeam, type TeamMember } from "@/lib/content";

export const metadata: Metadata = pageMeta({
  title: "Leadership team",
  description: "Meet the students who lead Act for Community in Bishkek and organise our charity tournaments, fairs, concerts and gift drives.",
  path: "/team",
});

/** How many empty slots to show while the team list hasn't been added to the CMS yet. */
const PLACEHOLDER_SLOTS = 6;

export default function TeamPage() {
  const team = getTeam();
  const empty = team.length === 0;

  return (
    <>
      <PageHero
        eyebrow="Leadership team"
        title={[["The people"], [{ text: "behind", accent: true }, "every event."]]}
        intro="Act for Community is run by students who plan, organise and show up — for every tournament, fair and drive."
      />

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          {empty && (
            <p className="mb-8 flex items-start gap-3 rounded-2xl bg-sun-soft p-4 text-sm font-medium sm:items-center">
              <Info className="mt-0.5 size-5 shrink-0 sm:mt-0" aria-hidden />
              Our team profiles are being prepared. Names, photos and positions will appear here soon.
            </p>
          )}
          <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {empty
              ? Array.from({ length: PLACEHOLDER_SLOTS }, (_, i) => (
                  <StaggerItem key={i}>
                    <PlaceholderCard />
                  </StaggerItem>
                ))
              : team.map((m) => (
                  <StaggerItem key={m.slug}>
                    <MemberCard member={m} />
                  </StaggerItem>
                ))}
            <StaggerItem>
              <JoinCard />
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <TwoPaths />
    </>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="group" tabIndex={member.bio ? 0 : undefined}>
      <div className="relative overflow-hidden rounded-[1.75rem]">
        <Photo
          src={member.photo}
          alt={member.photo ? `Portrait of ${member.name}` : ""}
          label={member.photo ? undefined : "Upload portrait in the CMS"}
          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
          className="aspect-[4/5]"
          imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-105"
        />
        {member.bio && (
          <div className="absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-brand-950/90 via-brand-950/50 to-transparent p-5 text-sm leading-relaxed text-white opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex">
            <p className="translate-y-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-y-0">{member.bio}</p>
          </div>
        )}
        <span className="absolute top-3 right-3 h-1.5 w-8 rounded-full bg-sun transition-all duration-500 group-hover:w-14" aria-hidden />
      </div>
      <h2 className="mt-4 text-base font-semibold tracking-tight sm:text-lg">{member.name}</h2>
      <p className="mt-0.5 text-sm font-semibold text-brand-600">{member.role}</p>
      {member.bio && <p className="mt-2 line-clamp-3 text-sm text-ink-soft md:hidden">{member.bio}</p>}
    </article>
  );
}

function PlaceholderCard() {
  return (
    <div aria-label="Team member profile coming soon">
      <div className="bg-stripes grid aspect-[4/5] place-items-center rounded-[1.75rem] border-2 border-dashed border-brand-200">
        <span className="grid size-16 place-items-center rounded-full bg-white/80 text-brand-300">
          <UserRound className="size-8" aria-hidden />
        </span>
      </div>
      <div className="mt-4 h-4 w-3/4 rounded-full bg-sky-deep" aria-hidden />
      <div className="mt-2 h-3 w-1/2 rounded-full bg-sky" aria-hidden />
      <p className="sr-only">Name and position coming soon</p>
    </div>
  );
}

function JoinCard() {
  return (
    <Link
      href="/volunteer"
      className="group flex aspect-[4/5] flex-col justify-between rounded-[1.75rem] bg-brand-600 p-5 text-white transition-transform duration-500 hover:-translate-y-1 sm:p-7"
    >
      <span className="grid size-11 place-items-center self-end rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
        <ArrowUpRight className="size-5" aria-hidden />
      </span>
      <span>
        <span className="block font-display text-xl leading-tight font-semibold sm:text-2xl">This could be you.</span>
        <span className="mt-2 block text-sm text-white/75">Join as a volunteer →</span>
      </span>
    </Link>
  );
}
