"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Animates a number from its previous value to `value` (count-up on mount, tween on change). */
export function useCountUp(value: number, duration = 1.2, delay = 0) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const controls = animate(current.current, value, {
      duration,
      delay,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, duration, delay]);

  return display;
}
