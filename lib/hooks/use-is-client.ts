"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false durante el render de servidor y la hidratación; true después. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
