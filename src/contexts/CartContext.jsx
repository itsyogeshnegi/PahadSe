import { createContext, useContext, useEffect, useState } from "react";

import { DELIVERY_CHARGE_DELHI } from "@/lib/contact";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pahadse_cart");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
        return [];
      }
    }
    return [];
  });

  const [shippingRegion, setShippingRegion] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pahadse_shipping_region");
        return stored || "delhi_ncr";
      } catch (e) {
        return "delhi_ncr";
      }
    }
    return "delhi_ncr";
  });

  useEffect(() => {
    try {
      localStorage.setItem("pahadse_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("pahadse_shipping_region", shippingRegion);
    } catch (e) {
      console.error("Failed to save shipping region to localStorage", e);
    }
  }, [shippingRegion]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge =
    shippingRegion === "delhi_ncr"
      ? (subtotal > 0 && subtotal <= 299 ? DELIVERY_CHARGE_DELHI : 0)
      : 0;
  const total = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryCharge,
        total,
        shippingRegion,
        setShippingRegion,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
