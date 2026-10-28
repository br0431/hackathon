import Link from "next/link";

import { BRAND } from "@/config/brand";

export function Logo() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-full">
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <circle cx="19" cy="19" r="16.5" fill="#FFC933" stroke="#1B1340" strokeWidth="2.5" />
        <path
          d="M12 23 L19 13 L26 23"
          fill="none"
          stroke="#1B1340"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-3xl font-extrabold tracking-tight">{BRAND.name}</span>
    </Link>
  );
}
