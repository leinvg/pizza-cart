"use client";

import { Drink } from "@/types";
import SafeImage from "@/components/SafeImage";

interface DrinkCardProps {
  drink: Drink;
  onSelect: (drink: Drink) => void;
}

export function DrinkCard({ drink, onSelect }: DrinkCardProps) {
  const minPrice = Math.min(...drink.variants.map((v) => v.price));
  const maxPrice = Math.max(...drink.variants.map((v) => v.price));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-800 flex items-center justify-center">
        <SafeImage src={drink.variants[0].image} alt={drink.name} />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{drink.name}</h3>

        <div className="mb-3">
          <p className="text-sm text-gray-500">
            Tamaños: {drink.variants.map((v) => v.volume).join(", ")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-blue-600">
            {minPrice === maxPrice
              ? `$${minPrice.toFixed(2)}`
              : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
          </div>

          <button
            onClick={() => onSelect(drink)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Elegir
          </button>
        </div>
      </div>
    </div>
  );
}
