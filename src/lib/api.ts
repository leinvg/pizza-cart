import { Pizza, Drink, Extra, Promo } from "@/types";

const API_BASE_URL = "/api";

/**
 * Fetch pizzas de local JSON
 */
export async function fetchPizzas(): Promise<Pizza[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pizzas.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch pizzas: ${response.statusText}`);
    }

    const data: Pizza[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pizzas:", error);
    throw error;
  }
}

/**
 * Fetch drinks de local JSON
 */
export async function fetchDrinks(): Promise<Drink[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/drinks.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch drinks: ${response.statusText}`);
    }

    const data: Drink[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching drinks:", error);
    throw error;
  }
}

/**
 * Fetch extras de local JSON
 */
export async function fetchExtras(): Promise<Extra[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/extras.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch extras: ${response.statusText}`);
    }

    const data: Extra[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching extras:", error);
    throw error;
  }
}

/**
 * Fetch promos de local JSON
 */
export async function fetchPromos(): Promise<Promo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/promos.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch promos: ${response.statusText}`);
    }

    const data: Promo[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching promos:", error);
    throw error;
  }
}

/**
 * Fetch todos los productos (pizzas, bebidas, extras, promos)
 */
export async function fetchAllProducts() {
  try {
    const [pizzas, drinks, extras, promos] = await Promise.all([
      fetchPizzas(),
      fetchDrinks(),
      fetchExtras(),
      fetchPromos(),
    ]);

    return { pizzas, drinks, extras, promos };
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
}
