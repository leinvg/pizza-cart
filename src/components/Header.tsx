"use client";

import { ShoppingBasket } from "lucide-react";

interface HeaderProps {
  items: any[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const NAV_LINKS = [
  { label: "Promociones", href: "#promos" },
  { label: "Pizzas", href: "#pizzas" },
  { label: "Bebidas", href: "#bebidas" },
];

export default function Header({
  items,
  isCartOpen,
  setIsCartOpen,
}: HeaderProps) {
  return (
    <div className="py-3 border-b bg-neutral-800 border-neutral-600 sticky top-0 z-10">
      <div
        className={`container flex flex-row items-center justify-between mx-auto ${isCartOpen ? "px-[6%]" : "px-4"}`}
      >
        {/* Logo */}
        <a href="/">
          <h1 className="text-xl/5 font-bold text-lime-400 mb-0.5">
            D'LIPIZZA
          </h1>
          <p className="text-xs/3 font-medium">
            Las mejores pizzas. Al mejor precio.
          </p>
        </a>
        {/* Navbar */}
        <nav className="flex items-center gap-4">
          {NAV_LINKS.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className="py-1 px-2 text-sm/6 font-semibold transition-colors hover:text-lime-400"
            >
              {tab.label}
            </a>
          ))}
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="text-stone-950/80 bg-lime-400 hover:bg-lime-500 ml-4 py-1 pl-2 pr-3 gap-2 rounded-full transition-colors flex items-center cursor-pointer"
          >
            <ShoppingBasket size={24} strokeWidth={1.75} />
            <span className="text-sm font-bold">{items.length}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
