import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OrderItem, OrderPizza, OrderDrink, OrderPromo } from "@/types";

interface CartStore {
  // Estado
  items: OrderItem[];

  // Acciones
  addPizza: (pizza: OrderPizza) => void;
  addDrink: (drink: OrderDrink) => void;
  addPromo: (promo: OrderPromo) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],

      // Agregar pizza individual
      addPizza: (pizza) => {
        set((state) => {
          const newItem: OrderItem = {
            id: crypto.randomUUID(),
            itemType: "pizza",
            quantity: 1,
            pizza,
            totalPrice: pizza.finalPrice,
          };
          return { items: [...state.items, newItem] };
        });
      },

      // Agregar bebida individual
      addDrink: (drink) => {
        set((state) => {
          const newItem: OrderItem = {
            id: crypto.randomUUID(),
            itemType: "drink",
            quantity: 1,
            drink,
            totalPrice: drink.price,
          };
          return { items: [...state.items, newItem] };
        });
      },

      // Agregar combo/promo
      addPromo: (promo) => {
        set((state) => {
          const newItem: OrderItem = {
            id: crypto.randomUUID(),
            itemType: "promo",
            quantity: 1,
            promo,
            totalPrice: promo.finalPrice,
          };
          return { items: [...state.items, newItem] };
        });
      },

      // Eliminar item del carrito
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // Actualizar cantidad de un item
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }

          const updatedItems = state.items.map((item) => {
            if (item.id !== id) return item;

            // Recalcular totalPrice según el tipo de item
            let unitPrice = 0;
            if (item.itemType === "pizza" && item.pizza) {
              unitPrice = item.pizza.finalPrice;
            } else if (item.itemType === "drink" && item.drink) {
              unitPrice = item.drink.price;
            } else if (item.itemType === "promo" && item.promo) {
              unitPrice = item.promo.finalPrice;
            }

            return {
              ...item,
              quantity,
              totalPrice: unitPrice * quantity,
            };
          });

          return { items: updatedItems };
        });
      },

      // Vaciar carrito
      clearCart: () => {
        set({ items: [] });
      },

      // Calcular total del carrito
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.totalPrice, 0);
      },
    }),
    {
      name: "pizza-cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
