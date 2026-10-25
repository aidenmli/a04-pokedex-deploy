import { formatPokemonName } from "@/utils/flavor-text-formatter";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// Light backgrounds need dark text to stay readable.
const LIGHT_TYPES = new Set([
  "normal",
  "electric",
  "ice",
  "ground",
  "steel",
  "bug",
  "grass",
  "fairy",
]);

export default function TypeBadge({ type }: { type: string }) {
  const background = TYPE_COLORS[type] ?? "#68A090";
  const color = LIGHT_TYPES.has(type) ? "#1c1c1e" : "#ffffff";

  return (
    <span
      className="rounded-full px-3 py-1 text-sm font-semibold"
      style={{ backgroundColor: background, color }}
    >
      {formatPokemonName(type)}
    </span>
  );
}
