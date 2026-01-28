"use client";

import { useState } from "react";
import { Drink, DrinkSize } from "@/types";
import { buildOrderDrink } from "@/lib/orderHelpers";
import { useCartStore } from "@/store/cartStore";
import SafeImage from "@/components/SafeImage";
import { X } from "lucide-react";

interface DrinkSelectorProps {
  drink: Drink;
  onClose: () => void;
  onAdd?: () => void;
  initialSize?: DrinkSize;
}

export function DrinkSelector({
  drink,
  onClose,
  onAdd,
  initialSize,
}: DrinkSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<DrinkSize | null>(
    initialSize ?? null,
  );
  const addDrink = useCartStore((state) => state.addDrink);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    try {
      const orderDrink = buildOrderDrink(drink, selectedSize);
      addDrink(orderDrink);
      onClose();
      onAdd?.();
    } catch (error) {
      console.error("Error adding drink:", error);
      alert("Error al agregar bebida");
    }
  };

  const selectedVariant = selectedSize
    ? drink.variants.find((v) => v.size === selectedSize)
    : null;

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-800 border-b border-neutral-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{drink.name}</h2>
          <button onClick={onClose} className="text-2xl cursor-pointer">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-x-6 flex">
          {/* Image */}
          {selectedVariant?.image && (
            <div className="relative w-60 overflow-hidden rounded-xl shrink-0">
              <SafeImage src={selectedVariant.image} alt={drink.name} />
            </div>
          )}

          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-semibold mb-3 pl-4">Elige el tamaño</h3>
            <div className="space-y-2">
              {drink.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`w-full px-4 py-2 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedSize === variant.size
                      ? "border-lime-400"
                      : "border-neutral-800 hover:border-lime-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-semibold capitalize">
                        {variant.size}
                      </div>
                      <div className="text-sm text-stone-50/70">{variant.volume}</div>
                    </div>
                    <div className="text-lg font-semibold text-lime-400">
                      ${variant.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
              {/* Footer */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition-colors cursor-pointer text-stone-950/80 bg-lime-400 hover:bg-lime-500`}
              >
                {selectedSize
                  ? `Agregar - $${selectedVariant?.price.toFixed(2)}`
                  : "Selecciona un tamaño"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
