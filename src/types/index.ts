// Tipos de tamaños
export type PizzaSize = "small" | "medium" | "large" | "xlarge";
export type DrinkSize = "small" | "medium" | "large";
export type ProductType = "pizza" | "drink" | "extra" | "promo";

// Interfaz para variantes
export interface PizzaVariant {
  size: PizzaSize;
  slices: number;
  price: number;
}

export interface DrinkVariant {
  size: DrinkSize;
  volume: string;
  price: number;
  image: string;
}

// Interfaz base para productos
export interface Product {
  id: string;
  name: string;
  image?: string;
}

// Interfaz para pizzas
export interface Pizza extends Product {
  description: string;
  variants: PizzaVariant[];
}

// Interfaz para bebidas
export interface Drink extends Product {
  variants: DrinkVariant[];
}

// Interfaz para extras
export interface Extra extends Product {
  price: number;
}

// Interfaces para promos
export interface PromoItemConfig {
  quantity: number;
  size: PizzaSize | DrinkSize;
  allowedPizzas?: string[];
  allowedDrinks?: string[];
}

export interface PromoExtrasConfig {
  maxQuantity: number;
  allowedExtras: string[];
}

export interface PromoConfig {
  pizzas: PromoItemConfig;
  drinks: PromoItemConfig;
  extras: PromoExtrasConfig;
}

export interface Promo extends Product {
  description: string;
  price: number;
  config: PromoConfig;
}

// Interfaz para items en el carrito/orden
export interface OrderExtra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Pizza individual en el pedido
export interface OrderPizza {
  pizzaId: string;
  name: string;
  description: string;
  image: string;
  size: PizzaSize;
  slices: number;
  basePrice: number;
  extras: OrderExtra[];
  finalPrice: number;
}

// Bebida individual en el pedido
export interface OrderDrink {
  drinkId: string;
  name: string;
  size: DrinkSize;
  volume: string;
  image: string;
  price: number;
}

// Combo en el pedido
export interface OrderPromo {
  promoId: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  selectedPizzas: Array<{
    pizzaId: string;
    name: string;
    description: string;
    image: string;
    size: PizzaSize;
    slices: number;
    extras: OrderExtra[];
  }>;
  selectedDrinks: Array<{
    drinkId: string;
    name: string;
    size: DrinkSize;
    volume: string;
    image: string;
  }>;
  finalPrice: number;
}

// Item en el pedido (pizza, bebida o combo)
export interface OrderItem {
  id: string;
  itemType: "pizza" | "drink" | "promo";
  quantity: number;

  // Solo uno estará presente según itemType
  pizza?: OrderPizza;
  drink?: OrderDrink;
  promo?: OrderPromo;

  // Precio total de este item
  totalPrice: number;
}

// Pedido completo
export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: "cart" | "confirmed" | "preparing" | "ready" | "delivered";
}
