"use client";

import { Promo } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface PromoCardProps {
  promo: Promo;
  onSelect: (promo: Promo) => void;
}

export function PromoCard({ promo, onSelect }: PromoCardProps) {
  const initialImg = promo.image || "/img/placeholder.jpg";
  const [imgSrc, setImgSrc] = useState(initialImg);

  return (
    <div className="bg-linear-to-br from-orange-50 to-yellow-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-orange-200">
      <div className="relative h-56 w-full">
        <Image
          src={imgSrc}
          alt={promo.name}
          fill
          className="object-cover"
          onError={() => setImgSrc("/img/placeholder.jpg")}
        />
        <div className="absolute top-3 right-3 bg-red-500 text-white font-bold py-1 px-3 rounded-full text-sm shadow-lg">
          OFERTA
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-2xl font-bold mb-2 text-orange-700">
          {promo.name}
        </h3>
        <p className="text-gray-700 mb-4 min-h-12">{promo.description}</p>

        <div className="bg-white rounded-lg p-3 mb-4 border border-orange-200">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🍕</span>
              <span>
                {promo.config.pizzas.quantity} pizza(s){" "}
                {promo.config.pizzas.size}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">🥤</span>
              <span>
                {promo.config.drinks.quantity} bebida(s){" "}
                {promo.config.drinks.size}
              </span>
            </div>
            {promo.config.extras.maxQuantity > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">➕</span>
                <span>Hasta {promo.config.extras.maxQuantity} extras</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-orange-600">
            ${promo.price.toFixed(2)}
          </div>

          <button
            onClick={() => onSelect(promo)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Armar Combo
          </button>
        </div>
      </div>
    </div>
  );
}
