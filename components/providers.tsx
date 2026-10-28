"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Proveedores globales de cliente. Motion respeta prefers-reduced-motion en toda la app. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
