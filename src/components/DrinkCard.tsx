"use client";

import { Drink } from "@/types";
import SafeImage from "@/components/SafeImage";
import { Plus } from "lucide-react";

interface DrinkCardProps {
  drink: Drink;
  onSelect: (drink: Drink) => void;
}

export function DrinkCard({ drink, onSelect }: DrinkCardProps) {
  const minPrice = Math.min(...drink.variants.map((v) => v.price));
  const maxPrice = Math.max(...drink.variants.map((v) => v.price));

  return (
    <div className="rounded-2xl bg-neutral-700 shadow-md overflow-hidden hover:shadow-lg transition-shadow flex">
      <div className="relative min-w-15 w-1/4">
        <SafeImage src={drink.variants[0].image} alt={drink.name} />
      </div>
      <div className="flex items-end p-6 gap-6 flex-1">
        <div className="flex-1 h-full">
          <h3 className="text-base/5 font-semibold mb-1">{drink.name}</h3>
          <p className="text-sm text-stone-50/60">
            {drink.variants.map((v) => v.volume).join(", ")}
          </p>
        </div>
        <button
          onClick={() => onSelect(drink)}
          className="bg-lime-400 hover:bg-lime-500 text-sm text-stone-950/80 font-semibold p-2 w-fit rounded-lg transition-colors cursor-pointer"
          aria-label={`Ver tamaños de ${drink.name}`}
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
