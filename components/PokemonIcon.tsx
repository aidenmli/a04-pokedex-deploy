"use client";

import { useState } from "react";

/**
 * Small pokesprite icon (https://msikma.github.io/pokesprite/).
 * Loaded straight from GitHub, so nothing is stored in the project.
 * Some alternate forms have no icon, so we keep an empty box instead of a broken image.
 */
export default function PokemonIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span aria-hidden className="h-[30px] w-[40px] shrink-0" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/${name}.png`}
      alt=""
      width={40}
      height={30}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-[30px] w-[40px] shrink-0 [image-rendering:pixelated]"
    />
  );
}
