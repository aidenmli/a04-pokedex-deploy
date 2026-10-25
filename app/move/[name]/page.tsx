import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import TypeBadge from "@/components/TypeBadge";
import { Move } from "@/data/models/move";
import {
  formatFlavorText,
  formatPokemonName,
} from "@/utils/flavor-text-formatter";

export default async function MovePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const response = await fetch(`https://pokeapi.co/api/v2/move/${name}/`);
  if (!response.ok) notFound();
  const move = (await response.json()) as unknown as Move;

  const englishEntry = move.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );
  const description = englishEntry
    ? formatFlavorText(englishEntry.flavor_text)
    : "No description available.";

  // Status moves have no power or accuracy (the API returns null).
  const stats: [string, string | number][] = [
    ["Category", formatPokemonName(move.damage_class.name)],
    ["Power", move.power ?? "—"],
    ["Accuracy", move.accuracy ?? "—"],
    ["PP", move.pp],
  ];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <BackButton />

      <h1 className="mt-6 mb-3 text-4xl font-black tracking-tight">
        {formatPokemonName(move.name)}
      </h1>
      <TypeBadge type={move.type.name} />
      <p className="mt-4 mb-8 leading-relaxed">{description}</p>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-neutral-300 bg-white p-3 text-center"
          >
            <dt className="text-sm text-neutral-500">{label}</dt>
            <dd className="text-xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
