"use client";

import { motion } from "framer-motion";

/**
 * Gentle rise on every page change. Only transform is animated (no opacity),
 * so the content counts as visible immediately — good for Largest Contentful Paint.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
