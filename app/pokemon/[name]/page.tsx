import Link from "next/link";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import TypeBadge from "@/components/TypeBadge";
import { Pokemon } from "@/data/models/pokemon";
import { PokemonSpecies } from "@/data/models/pokemon-species";
import {
  formatFlavorText,
  formatPokemonName,
} from "@/utils/flavor-text-formatter";

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const pokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name}`
  );
  if (!pokemonResponse.ok) notFound();
  const pokemon = (await pokemonResponse.json()) as unknown as Pokemon;

  // Use the species name from the Pokemon data: alternate forms
  // (e.g. "charizard-mega-x") share their base species' record.
  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon.species.name}`
  );
  if (!speciesResponse.ok) notFound();
  const species = (await speciesResponse.json()) as unknown as PokemonSpecies;

  const englishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );
  const description = englishEntry
    ? formatFlavorText(englishEntry.flavor_text)
    : "No description available.";

  const displayName = formatPokemonName(pokemon.name);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <BackButton />

      <section className="mt-6 flex flex-col items-center gap-3 text-center">
        {pokemon.sprites.front_default ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pokemon.sprites.front_default}
            alt={displayName}
            width={192}
            height={192}
            className="h-48 w-48 [image-rendering:pixelated]"
          />
        ) : (
          <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500">
            No image
          </div>
        )}

        <h1 className="text-4xl font-black tracking-tight">{displayName}</h1>

        <div className="flex gap-2">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.slot} type={t.type.name} />
          ))}
        </div>

        {(species.is_legendary || species.is_mythical) && (
          <p className="font-semibold text-amber-600">
            {species.is_legendary ? "Legendary" : "Mythical"}
          </p>
        )}

        <p className="max-w-xl leading-relaxed">{description}</p>

        {species.evolves_from_species && (
          <p>
            Evolves from{" "}
            <Link
              href={`/pokemon/${species.evolves_from_species.name}`}
              className="font-semibold text-red-700 underline"
            >
              {formatPokemonName(species.evolves_from_species.name)}
            </Link>
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-2xl font-bold">Base stats</h2>
        <ul className="space-y-2">
          {pokemon.stats.map((s) => (
            <li key={s.stat.name} className="flex items-center gap-3">
              <span className="w-36 shrink-0 font-medium">
                {formatPokemonName(s.stat.name)}
              </span>
              <span className="w-10 shrink-0 font-mono">{s.base_stat}</span>
              <div className="h-3 flex-1 rounded-full bg-neutral-200">
                <div
                  className="h-3 rounded-full bg-red-600"
                  style={{
                    width: `${Math.min(100, (s.base_stat / 255) * 100)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-2xl font-bold">Moves</h2>
        <ul className="flex flex-wrap gap-2">
          {pokemon.moves.map((m) => (
            <li key={m.move.name}>
              <Link
                href={`/move/${m.move.name}`}
                className="block rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:border-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"
              >
                {formatPokemonName(m.move.name)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
