import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { DELIVERY_CHARGE_DELHI } from "@/lib/contact";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { flavours } from "@/components/home/home-data";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

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

  // Sync cart from Firestore database when user changes
  useEffect(() => {
    async function loadUserCart() {
      if (!user) return;
      setIsSyncing(true);
      try {
        const cartDocRef = doc(db, "cart", user.uid);
        const docSnap = await getDoc(cartDocRef);
        if (docSnap.exists()) {
          const dbItems = docSnap.data().items || [];
          setCart((prevCart) => {
            const merged = [...prevCart];
            dbItems.forEach((dbItem) => {
              const flavour = flavours.find((f) => f.name === dbItem.item_name || f.id === dbItem.id);
              const itemId = flavour?.id || dbItem.id || dbItem.item_name;
              const itemPrice = flavour?.price || 0;
              const itemQuantity = Number(dbItem.count || dbItem.quantity || 1);

              const existing = merged.find((item) => item.id === itemId);
              if (existing) {
                existing.quantity = Math.max(existing.quantity, itemQuantity);
              } else {
                merged.push({
                  id: itemId,
                  name: dbItem.item_name || dbItem.name || itemId,
                  price: itemPrice,
                  quantity: itemQuantity,
                });
              }
            });
            return merged;
          });
        }
      } catch (e) {
        console.error("Failed to sync cart from Firestore", e);
      } finally {
        setIsSyncing(false);
      }
    }
    loadUserCart();
  }, [user]);

  // Sync cart to Firestore database when cart changes
  useEffect(() => {
    if (isSyncing || !user) return;
    const saveCartToDb = async () => {
      try {
        const cartDocRef = doc(db, "cart", user.uid);
        const firestoreItems = cart.map((item) => ({
          id: item.id,
          item_name: item.name,
          count: Number(item.quantity),
        }));
        await setDoc(cartDocRef, { items: firestoreItems, updatedAt: new Date().toISOString() });
      } catch (e) {
        console.error("Failed to save cart to Firestore", e);
      }
    };
    const timer = setTimeout(saveCartToDb, 500);
    return () => clearTimeout(timer);
  }, [cart, user, isSyncing]);

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
  const freePacketsCount = subtotal >= 399 ? 2 : 0;

  const contextValue = useMemo(
    () => ({
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
      freePacketsCount,
    }),
    [
      cart,
      cartCount,
      subtotal,
      deliveryCharge,
      total,
      shippingRegion,
      freePacketsCount,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
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
