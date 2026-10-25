import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-4 border-red-900 bg-red-600 shadow-md">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-4">
        {/* The Pokédex "lens" */}
        <span
          aria-hidden
          className="h-10 w-10 rounded-full border-4 border-white bg-sky-400 shadow-inner"
        />
        <Link href="/" className="text-3xl font-black tracking-tight text-white">
          Pokédex
        </Link>
      </div>
    </header>
  );
}
