"use client";

import { useEffect, useState } from "react";
import {
  HORIZONTAL_BALL_SIZE,
  HORIZONTAL_BALL_SIZE_MOBILE,
} from "@/lib/creatorBallSizes";

const MOBILE_MAX_WIDTH = 639;

/** Larger balls on narrow viewports; OBS desktop stays at base size. */
export function useHorizontalBallSize() {
  const [size, setSize] = useState(HORIZONTAL_BALL_SIZE);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const update = () => {
      setSize(mq.matches ? HORIZONTAL_BALL_SIZE_MOBILE : HORIZONTAL_BALL_SIZE);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return size;
}
