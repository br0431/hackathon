"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/motion";

/** Sello del perfil de jugador: entra con escala y rotación. */
export function StampBadge({ children, delay = 1.2 }: { children: ReactNode; delay?: number }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { scale: 1.8, rotate: -14, opacity: 0 }}
      animate={{ scale: 1, rotate: -3, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay }}
      className="inline-block rounded-2xl border-[3px] border-ink bg-sun px-5 py-3 shadow-hard"
    >
      {children}
    </motion.div>
  );
}
