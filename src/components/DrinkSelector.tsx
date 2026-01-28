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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-4xl shadow-xl max-w-md w-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-800 px-6 pt-6 flex items-center justify-between">
          <h2 className="font-semibold">{drink.name}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-stone-400 hover:text-stone-50"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex gap-6">
          {/* Image */}
          {selectedVariant?.image && (
            <div className="relative w-40 overflow-hidden rounded-lg shrink-0">
              <SafeImage src={selectedVariant.image} alt={drink.name} />
            </div>
          )}

          {/* Size Selection */}
          <div className="space-y-1">
            {drink.variants.map((variant) => (
              <button
                key={variant.size}
                onClick={() => setSelectedSize(variant.size)}
                className={`w-full px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  selectedSize === variant.size
                    ? "bg-neutral-700 border-lime-400"
                    : "border-neutral-800 hover:bg-neutral-700/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold capitalize">
                      {variant.size}
                    </span>
                    <span className="text-xs text-stone-50/70">
                      {variant.volume}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-lime-400">
                    $ {variant.price.toFixed(2)}
                  </div>
                </div>
              </button>
            ))}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full mt-5 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer text-stone-950/80 bg-lime-400 hover:bg-lime-500`}
            >
              Agregar al pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
