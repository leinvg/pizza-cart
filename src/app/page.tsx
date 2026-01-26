"use client";

import { useEffect, useState, useRef } from "react";
import { Pizza, Drink, Promo } from "@/types";
import { fetchAllProducts } from "@/lib/api";
import { PizzaCard } from "@/components/PizzaCard";
import { DrinkCard } from "@/components/DrinkCard";
import { PromoCard } from "@/components/PromoCard";
import { DrinkSelector } from "@/components/DrinkSelector";
import { CartSidebar } from "@/components/CartSidebar";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBasket } from "lucide-react";

export default function Home() {
  // Refs para scroll
  const promosRef = useRef<HTMLDivElement>(null);
  const pizzasRef = useRef<HTMLDivElement>(null);
  const drinksRef = useRef<HTMLDivElement>(null);
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
    <div className="min-h-screen flex flex-col">
      {/* Header con navegación y carrito */}
      <div className="py-2 border-b bg-neutral-800 border-neutral-600 sticky top-0 z-10">
        <div className="relative container flex flex-row items-center justify-between mx-auto px-4">
          {/* Logo */}
          <a href="/" className="flex flex-col">
            <h1 className="text-2xl/5 font-bold text-lime-500">DELIZZA</h1>
            <p className="text-sm/tight font-medium">
              Las mejores pizzas. Al mejor precio.
            </p>
          </a>
          {/* Navbar navegación */}
          <nav className="flex gap-2 text-sm text-stone-300">
            <button
              onClick={() =>
                promosRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="py-3 px-4 font-semibold transition-colors relative rounded-lg focus:outline-none cursor-pointer hover:text-lime-400"
            >
              Promociones
            </button>
            <button
              onClick={() =>
                pizzasRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="py-3 px-4 font-semibold transition-colors relative rounded-lg focus:outline-none cursor-pointer hover:text-lime-400"
            >
              Pizzas
            </button>
            <button
              onClick={() =>
                drinksRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="py-3 px-4 font-semibold transition-colors relative rounded-lg focus:outline-none cursor-pointer hover:text-lime-400"
            >
              Bebidas
            </button>
          </nav>
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="text-stone-300 hover:text-white py-3 px-4 font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBasket size={24} strokeWidth={1.75} />
            {items.length > 0 && (
              <span className="bg-red-400 text-white text-xs font-bold rounded-full w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Layout con Sidebar y secciones apiladas */}
      <div className="flex flex-1 overflow-hidden container mx-auto px-4">
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-8 space-y-16">
            {/* Promociones */}
            <section ref={promosRef}>
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
            </section>

            {/* Pizzas */}
            <section ref={pizzasRef}>
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

            {/* Bebidas */}
            <section ref={drinksRef}>
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
        </div>

        {/* Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>

      {/* Modals */}
      {selectedDrink && (
        <DrinkSelector
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
          onAdd={handleDrinkAdded}
        />
      )}
    </div>
  );
}
