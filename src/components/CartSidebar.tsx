"use client";

import { useCartStore } from "@/store/cartStore";
import { X } from "lucide-react";
import { Trash2 } from "lucide-react";
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
      className={`fixed top-0 right-0 h-screen w-full max-w-[24rem] bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800/80 shadow-2xl flex flex-col z-30 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="px-6 flex items-center justify-between h-16 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-950/90 to-neutral-950/60">
        <h2 className="text-lg font-semibold tracking-wide">Pedido</h2>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-full p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
          aria-label="Cerrar carrito"
        >
          <X size={24} strokeWidth={1.75} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-neutral-300">
              <p className="text-lg font-semibold">Tu carrito está vacío</p>
              <p className="text-sm mt-2 text-neutral-500">
                Agrega productos para comenzar
              </p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-5 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
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
                            className="object-cover rounded-xl"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-100">
                            {item.pizza.name}
                          </h3>
                          <p className="text-sm text-neutral-400 capitalize">
                            {item.pizza.size} - {item.pizza.slices} porciones
                          </p>
                        </div>
                      </div>
                      {item.pizza.extras.length > 0 && (
                        <div className="text-xs text-neutral-400 pl-3 border-l-2 border-lime-400/80">
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
                    <div className="flex gap-6">
                      <div className="relative w-16 h-16 shrink-0">
                        <SafeImage
                          src={item.drink.image}
                          alt={item.drink.name}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-100">
                          {item.drink.name}
                        </h3>
                        <p className="text-sm text-neutral-400">
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
                            className="object-cover rounded-xl"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lime-400">
                            {item.promo.name}
                          </h3>
                          <p className="text-xs text-neutral-400">
                            {item.promo.selectedPizzas.length} pizza(s) +{" "}
                            {item.promo.selectedDrinks.length} bebida(s)
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800/80 rounded-full px-2 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-full text-neutral-200 font-bold transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-neutral-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-full text-neutral-200 font-bold transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-neutral-100">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="cursor-pointer rounded-full p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 transition-colors"
                        aria-label="Eliminar item"
                      >
                        <Trash2 size={20} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-red-400/90 text-sm font-semibold py-2 cursor-pointer hover:text-red-300 transition-colors"
                >
                  Vaciar carrito
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-800/80 p-6 space-y-6 sticky bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-neutral-950/40 backdrop-blur">
            <div className="flex items-center justify-between font-semibold px-1 text-neutral-200">
              <span>Total</span>
              <span className="text-lime-400">S/. {total.toFixed(2)}</span>
            </div>
            <button className="w-full text-sm text-neutral-950 bg-lime-400 hover:bg-lime-500 font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-[0_12px_30px_rgba(163,230,53,0.25)]">
              Realizar pedido
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
