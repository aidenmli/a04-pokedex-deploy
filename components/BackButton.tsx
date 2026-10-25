"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="rounded-lg border-2 border-red-600 px-4 py-2 font-semibold text-red-700 hover:bg-red-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      Back
    </button>
  );
}
