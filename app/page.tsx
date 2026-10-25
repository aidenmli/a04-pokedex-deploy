/** Home page. */
"use client";

import Link from "next/link";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Pokedex } from "@/data/models/pokedex";
import PokemonIcon from "@/components/PokemonIcon";
import { formatPokemonName } from "@/utils/flavor-text-formatter";

const PAGE_SIZE = 50;
const FAVORITES_KEY = "pokedex-favorites";

/** Pulls the Pokédex number out of a PokeAPI url like ".../pokemon/25/" */
function getId(url: string): string {
  const id = url.split("/").filter(Boolean).pop() ?? "";
  return id.padStart(4, "0");
}

export default function Home() {
  const [page, setPage] = useState(0);

  // Stretch goal: favorites persisted in localStorage.
  // The lazy initializer reads storage once, on the client only.
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (name: string) => {
    const updated = favorites.includes(name)
      ? favorites.filter((n) => n !== name)
      : [...favorites, name];
    setFavorites(updated);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch {
      // Storage can be unavailable (private mode); favorites just won't persist.
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["pokedex", page],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`
      );
      if (!response.ok) throw new Error("Could not load Pokémon.");
      return (await response.json()) as unknown as Pokedex;
    },
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      {isLoading && <p className="text-lg">Loading Pokémon...</p>}
      {!!error && (
        <p className="text-lg text-red-700">Error: {error.message}</p>
      )}

      {!!data && (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {data.results.map((pokemon) => {
              const isFavorite = favorites.includes(pokemon.name);
              const displayName = formatPokemonName(pokemon.name);

              return (
                <li
                  key={pokemon.name}
                  className="flex items-stretch overflow-hidden rounded-lg border border-neutral-300 bg-white"
                >
                  <Link
                    href={`/pokemon/${pokemon.name}`}
                    className="flex flex-1 items-center gap-2 px-3 py-2 hover:bg-red-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-600"
                  >
                    <PokemonIcon name={pokemon.name} />
                    <span className="flex flex-col">
                      <span className="font-mono text-xs text-neutral-500">
                        #{getId(pokemon.url)}
                      </span>
                      <span className="font-semibold">{displayName}</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(pokemon.name)}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? `Remove ${displayName} from favorites`
                        : `Add ${displayName} to favorites`
                    }
                    className={`px-3 text-2xl hover:bg-red-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-600 ${
                      isFavorite ? "text-yellow-500" : "text-neutral-400"
                    }`}
                  >
                    {isFavorite ? "★" : "☆"}
                  </button>
                </li>
              );
            })}
          </ul>

          <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono text-sm">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        </>
      )}
    </main>
  );
}
