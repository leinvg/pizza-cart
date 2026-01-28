"use client";

import { useCartStore } from "@/store/cartStore";
import { X } from "lucide-react";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const total = getTotal();

  return (
    <aside
      className={`fixed top-0 right-0 h-screen w-96 border-l border-neutral-600 flex flex-col z-30 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="px-6 flex items-center justify-between h-15">
        <h2 className="text-lg font-semibold">Pedido</h2>
        <button onClick={onClose} className="cursor-pointer">
          <X size={24} strokeWidth={1.75} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">Tu carrito está vacío</p>
              <p className="text-sm mt-2">Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-700 rounded-2xl p-6 space-y-3"
                >
                  {/* Pizza Item */}
                  {item.itemType === "pizza" && item.pizza && (
                    <>
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 shrink-0">
                          <Image
                            src={item.pizza.image}
                            alt={item.pizza.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.pizza.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {item.pizza.size} - {item.pizza.slices} porciones
                          </p>
                        </div>
                      </div>
                      {item.pizza.extras.length > 0 && (
                        <div className="text-xs text-gray-600 pl-2 border-l-2 border-lime-300">
                          {item.pizza.extras.map((extra) => (
                            <div key={extra.id}>
                              + {extra.name} x{extra.quantity}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Drink Item */}
                  {item.itemType === "drink" && item.drink && (
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 shrink-0">
                        <SafeImage
                          src={item.drink.image}
                          alt={item.drink.name}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.drink.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.drink.volume}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Promo Item */}
                  {item.itemType === "promo" && item.promo && (
                    <>
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 shrink-0">
                          <Image
                            src={item.promo.image}
                            alt={item.promo.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lime-600">
                            {item.promo.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.promo.selectedPizzas.length} pizza(s) +{" "}
                            {item.promo.selectedDrinks.length} bebida(s)
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-red-400 text-sm font-semibold py-2 cursor-pointer"
                >
                  Vaciar carrito
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-600 p-6 space-y-6 sticky bottom-0">
            <div className="flex items-center justify-between text-lg font-semibold px-1">
              <span>Total</span>
              <span className="text-lime-400">S/. {total.toFixed(2)}</span>
            </div>
            <button className="w-full text-stone-950/80 bg-lime-400 hover:bg-lime-500 font-semibold py-3 rounded-lg transition-colors cursor-pointer">
              Realizar pedido
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
