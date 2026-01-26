"use client";

import { Pizza } from "@/types";
import Image from "next/image";

interface PizzaCardProps {
  pizza: Pizza;
  onSelect: (pizza: Pizza) => void;
}

export function PizzaCard({ pizza, onSelect }: PizzaCardProps) {
  const minPrice = Math.min(...pizza.variants.map((v) => v.price));
  const maxPrice = Math.max(...pizza.variants.map((v) => v.price));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={pizza.image || "/placeholder-pizza.jpg"}
          alt={pizza.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{pizza.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pizza.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-orange-600">
            {minPrice === maxPrice
              ? `$${minPrice.toFixed(2)}`
              : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`}
          </div>

          <button
            onClick={() => onSelect(pizza)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Personalizar
          </button>
        </div>
      </div>
    </div>
  );
}
