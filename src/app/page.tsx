"use client";

import { useEffect, useState } from "react";
import { Pizza, Drink, Promo } from "@/types";
import { fetchAllProducts } from "@/lib/api";
import { PizzaCard } from "@/components/PizzaCard";
import { DrinkCard } from "@/components/DrinkCard";
import { PromoCard } from "@/components/PromoCard";
import { DrinkSelector } from "@/components/DrinkSelector";
import { CartSidebar } from "@/components/CartSidebar";
import { useCartStore } from "@/store/cartStore";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"promos" | "custom">("promos");
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-500 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🍕 Pizzería Delizioso
          </h1>
          <p className="text-xl md:text-2xl">
            Las mejores pizzas al mejor precio
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab("promos")}
              className={`py-4 px-6 font-semibold transition-colors relative ${
                activeTab === "promos"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              🎉 Promociones
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`py-4 px-6 font-semibold transition-colors relative ${
                activeTab === "custom"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              🍕 Arma tu Pedido
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "promos" ? (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Combos Promocionales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((promo) => (
                <PromoCard
                  key={promo.id}
                  promo={promo}
                  onSelect={handlePromoSelect}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Pizzas Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Nuestras Pizzas
              </h2>
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

            {/* Drinks Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Bebidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        )}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-30"
      >
        <div className="relative">
          <span className="text-2xl">🛒</span>
          {items.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </div>
          )}
        </div>
      </button>

      {/* Modals */}
      {selectedDrink && (
        <DrinkSelector
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
        />
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
