"use client";

import { useState } from "react";
import { Drink, DrinkSize } from "@/types";
import { buildOrderDrink } from "@/lib/orderHelpers";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

interface DrinkSelectorProps {
  drink: Drink;
  onClose: () => void;
  onAdd?: () => void;
}

export function DrinkSelector({ drink, onClose, onAdd }: DrinkSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<DrinkSize | null>(null);
  const addDrink = useCartStore((state) => state.addDrink);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    try {
      const orderDrink = buildOrderDrink(drink, selectedSize);
      addDrink(orderDrink);
      onClose();
      onAdd?.(); // Notificar que se agregó algo
    } catch (error) {
      console.error("Error adding drink:", error);
      alert("Error al agregar bebida");
    }
  };

  const selectedVariant = selectedSize
    ? drink.variants.find((v) => v.size === selectedSize)
    : null;

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{drink.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {selectedVariant?.image && (
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <Image
                  src={selectedVariant.image}
                  alt={drink.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Elige el tamaño
            </h3>
            <div className="space-y-2">
              {drink.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedSize === variant.size
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-semibold capitalize">
                        {variant.size}
                      </div>
                      <div className="text-sm text-gray-500">
                        {variant.volume}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ${variant.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              selectedSize
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedSize
              ? `Agregar - $${selectedVariant?.price.toFixed(2)}`
              : "Selecciona un tamaño"}
          </button>
        </div>
      </div>
    </div>
  );
}
