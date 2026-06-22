"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, Search } from "lucide-react";

import { cn } from "@/lib/utils";

type Section = "explore" | "search";

interface NavSwitchProps {
  /** Which section is currently shown — drives the glass thumb's position. */
  active: Section;
  /**
   * Optional in-page handler for the Explore item. When provided (on the
   * Explore route itself) the item is a <button>; otherwise it links to "/".
   */
  onExplore?: () => void;
}

/**
 * Apple "Liquid Glass" sliding switch for the Explore / Search sections.
 *
 * A frosted glass thumb slides under the active label. Explore ("/") and
 * Search ("/store") are separate routes, so the component remounts on
 * navigation — we lean into that by animating the thumb in from the opposite
 * side, which reads as the thumb sliding across the page change.
 */
export function NavSwitch({ active, onExplore }: NavSwitchProps) {
  const reduceMotion = useReducedMotion();
  const isExplore = active === "explore";

  // The thumb is half the rail wide; translateX(100%) moves it one slot right.
  const thumbTo = isExplore ? "0%" : "100%";
  const thumbFrom = isExplore ? "100%" : "0%";

  const exploreClasses = cn("lg-switch-item", isExplore && "lg-switch-item-active");
  const searchClasses = cn("lg-switch-item", !isExplore && "lg-switch-item-active");

  return (
    <div className="lg-switch" role="group" aria-label="Explore and Search">
      <motion.span
        aria-hidden="true"
        className="lg-switch-thumb"
        initial={reduceMotion ? false : { x: thumbFrom }}
        animate={{ x: thumbTo }}
        transition={
          reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 34 }
        }
      />

      {onExplore ? (
        <button
          type="button"
          onClick={onExplore}
          aria-current={isExplore ? "page" : undefined}
          className={exploreClasses}
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          Explore
        </button>
      ) : (
        <Link href="/" aria-current={isExplore ? "page" : undefined} className={exploreClasses}>
          <Compass className="h-4 w-4" aria-hidden="true" />
          Explore
        </Link>
      )}

      <Link
        href="/store"
        aria-current={!isExplore ? "page" : undefined}
        className={searchClasses}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Search
      </Link>
    </div>
  );
}

export default NavSwitch;
