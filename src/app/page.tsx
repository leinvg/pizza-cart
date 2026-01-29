"use client";

import { useEffect, useState } from "react";
import { Pizza, Drink, DrinkSize, Promo } from "@/types";
import { fetchAllProducts } from "@/lib/api";
import { PizzaCard } from "@/components/PizzaCard";
import { DrinkCard } from "@/components/DrinkCard";
import { PromoCard } from "@/components/PromoCard";
import { DrinkSelector } from "@/components/DrinkSelector";
import { CartSidebar } from "@/components/CartSidebar";
import { useCartStore } from "@/store/cartStore";
import Header from "@/components/Header";

export default function Home() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [initialDrinkSize, setInitialDrinkSize] = useState<
    DrinkSize | undefined
  >(undefined);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchAllProducts();
        setPizzas(data.pizzas);
        setDrinks(data.drinks);
        setPromos(data.promos);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handlePizzaSelect = (pizza: Pizza) => {
    console.log("Pizza seleccionada:", pizza);
    // TODO: Abrir modal de personalización
  };

  const handleDrinkSelect = (drink: Drink) => {
    setSelectedDrink(drink);
    setInitialDrinkSize(drink.variants[0]?.size);
  };

  const handleDrinkAdded = () => {
    setIsCartOpen(true);
  };

  const handlePromoSelect = (promo: Promo) => {
    console.log("Promo seleccionada:", promo);
    // TODO: Abrir modal de configuración de combo
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row">
      {/* Main Content */}
      <main
        className={`flex flex-col flex-1 transition-all duration-300 ${isCartOpen ? "pr-96" : ""}`}
      >
        <Header
          items={items}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
        <div
          className={`flex-1 gap-6 overflow-hidden container mx-auto w-full ${isCartOpen ? "px-[6%]" : "px-4"}`}
        >
          <div className="py-6 space-y-12">
            {/* Banner carrusel TODO */}
            <div className="bg-neutral-700 h-80 w-full rounded-xl"></div>
            {/* Promociones */}
            <section id="promos" className="scroll-mt-20">
              <h2 className="text-2xl font-semibold mb-6">
                Combos Promocionales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {promos.map((promo) => (
                  <PromoCard
                    key={promo.id}
                    promo={promo}
                    onSelect={handlePromoSelect}
                  />
                ))}
              </div>
            </section>

            {/* Pizzas */}
            <section id="pizzas" className="scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6">Nuestras Pizzas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pizzas.map((pizza) => (
                  <PizzaCard
                    key={pizza.id}
                    pizza={pizza}
                    onSelect={handlePizzaSelect}
                  />
                ))}
              </div>
            </section>

            {/* Bebidas */}
            <section id="bebidas" className="scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Bebidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {drinks.map((drink) => (
                  <DrinkCard
                    key={drink.id}
                    drink={drink}
                    onSelect={handleDrinkSelect}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
        {/* Modals */}
        {selectedDrink && (
          <DrinkSelector
            drink={selectedDrink}
            onClose={() => setSelectedDrink(null)}
            onAdd={handleDrinkAdded}
            initialSize={initialDrinkSize}
          />
        )}
      </main>
      {/* Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
