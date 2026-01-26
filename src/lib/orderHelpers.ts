import {
  Pizza,
  Drink,
  Extra,
  Promo,
  PizzaSize,
  DrinkSize,
  OrderPizza,
  OrderDrink,
  OrderPromo,
  OrderExtra,
} from "@/types";

/**
 * Convierte un Extra a OrderExtra
 */
export function buildOrderExtra(
  extra: Extra,
  quantity: number = 1,
): OrderExtra {
  return {
    id: extra.id,
    name: extra.name,
    price: extra.price,
    quantity,
  };
}

/**
 * Calcula el precio de una pizza con sus extras
 */
export function calculatePizzaPrice(
  basePrice: number,
  extras: OrderExtra[],
): number {
  const extrasTotal = extras.reduce(
    (sum, extra) => sum + extra.price * extra.quantity,
    0,
  );
  return basePrice + extrasTotal;
}

/**
 * Construye un objeto OrderPizza completo
 */
export function buildOrderPizza(
  pizza: Pizza,
  size: PizzaSize,
  extras: OrderExtra[] = [],
): OrderPizza {
  const variant = pizza.variants.find((v) => v.size === size);

  if (!variant) {
    throw new Error(`Size ${size} not found for pizza ${pizza.name}`);
  }

  const finalPrice = calculatePizzaPrice(variant.price, extras);

  return {
    pizzaId: pizza.id,
    name: pizza.name,
    description: pizza.description,
    image: pizza.image || "",
    size: variant.size,
    slices: variant.slices,
    basePrice: variant.price,
    extras,
    finalPrice,
  };
}

/**
 * Construye un objeto OrderDrink completo
 */
export function buildOrderDrink(drink: Drink, size: DrinkSize): OrderDrink {
  const variant = drink.variants.find((v) => v.size === size);

  if (!variant) {
    throw new Error(`Size ${size} not found for drink ${drink.name}`);
  }

  return {
    drinkId: drink.id,
    name: drink.name,
    size: variant.size,
    volume: variant.volume,
    image: variant.image,
    price: variant.price,
  };
}

/**
 * Validación de selección de promo
 */
export function validatePromoSelection(
  promo: Promo,
  selectedPizzas: Array<{ pizzaId: string; extras: OrderExtra[] }>,
  selectedDrinks: Array<{ drinkId: string }>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar cantidad de pizzas
  if (selectedPizzas.length !== promo.config.pizzas.quantity) {
    errors.push(`Debes seleccionar ${promo.config.pizzas.quantity} pizza(s)`);
  }

  // Validar pizzas permitidas
  if (
    promo.config.pizzas.allowedPizzas &&
    promo.config.pizzas.allowedPizzas.length > 0
  ) {
    selectedPizzas.forEach((sp, index) => {
      if (!promo.config.pizzas.allowedPizzas?.includes(sp.pizzaId)) {
        errors.push(`Pizza ${index + 1} no está permitida en este combo`);
      }
    });
  }

  // Validar cantidad de bebidas
  if (selectedDrinks.length !== promo.config.drinks.quantity) {
    errors.push(`Debes seleccionar ${promo.config.drinks.quantity} bebida(s)`);
  }

  // Validar bebidas permitidas
  if (
    promo.config.drinks.allowedDrinks &&
    promo.config.drinks.allowedDrinks.length > 0
  ) {
    selectedDrinks.forEach((sd, index) => {
      if (!promo.config.drinks.allowedDrinks?.includes(sd.drinkId)) {
        errors.push(`Bebida ${index + 1} no está permitida en este combo`);
      }
    });
  }

  // Validar cantidad total de extras
  const totalExtras = selectedPizzas.reduce(
    (sum, p) => sum + p.extras.reduce((s, e) => s + e.quantity, 0),
    0,
  );

  if (totalExtras > promo.config.extras.maxQuantity) {
    errors.push(`Máximo ${promo.config.extras.maxQuantity} extras permitidos`);
  }

  // Validar extras permitidos
  if (promo.config.extras.allowedExtras.length > 0) {
    selectedPizzas.forEach((sp) => {
      sp.extras.forEach((extra) => {
        if (!promo.config.extras.allowedExtras.includes(extra.id)) {
          errors.push(`Extra "${extra.name}" no está permitido en este combo`);
        }
      });
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Construye un objeto OrderPromo completo
 */
export function buildOrderPromo(
  promo: Promo,
  pizzas: Pizza[],
  drinks: Drink[],
  selectedPizzas: Array<{ pizzaId: string; extras: OrderExtra[] }>,
  selectedDrinks: Array<{ drinkId: string }>,
): OrderPromo {
  // Validar selección
  const validation = validatePromoSelection(
    promo,
    selectedPizzas,
    selectedDrinks,
  );
  if (!validation.valid) {
    throw new Error(`Selección inválida: ${validation.errors.join(", ")}`);
  }

  // Construir pizzas del combo
  const promoPizzas = selectedPizzas.map((sp) => {
    const pizza = pizzas.find((p) => p.id === sp.pizzaId);
    if (!pizza) {
      throw new Error(`Pizza ${sp.pizzaId} not found`);
    }

    const variant = pizza.variants.find(
      (v) => v.size === promo.config.pizzas.size,
    );
    if (!variant) {
      throw new Error(
        `Size ${promo.config.pizzas.size} not found for pizza ${pizza.name}`,
      );
    }

    return {
      pizzaId: pizza.id,
      name: pizza.name,
      description: pizza.description,
      image: pizza.image || "",
      size: variant.size,
      slices: variant.slices,
      extras: sp.extras,
    };
  });

  // Construir bebidas del combo
  const promoDrinks = selectedDrinks.map((sd) => {
    const drink = drinks.find((d) => d.id === sd.drinkId);
    if (!drink) {
      throw new Error(`Drink ${sd.drinkId} not found`);
    }

    const variant = drink.variants.find(
      (v) => v.size === promo.config.drinks.size,
    );
    if (!variant) {
      throw new Error(
        `Size ${promo.config.drinks.size} not found for drink ${drink.name}`,
      );
    }

    return {
      drinkId: drink.id,
      name: drink.name,
      size: variant.size,
      volume: variant.volume,
      image: variant.image,
    };
  });

  // Calcular precio final del combo (precio base + extras de todas las pizzas)
  const extrasTotal = selectedPizzas.reduce(
    (sum, sp) => sum + sp.extras.reduce((s, e) => s + e.price * e.quantity, 0),
    0,
  );

  const finalPrice = promo.price + extrasTotal;

  return {
    promoId: promo.id,
    name: promo.name,
    description: promo.description,
    image: promo.image || "",
    basePrice: promo.price,
    selectedPizzas: promoPizzas,
    selectedDrinks: promoDrinks,
    finalPrice,
  };
}
