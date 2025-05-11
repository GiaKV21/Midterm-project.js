'use client';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const fetches = localCart.map(async (item) => {
        const res = await fetch(`https://fakestoreapi.com/products/${item.id}`);
        const product = await res.json();
        return {
          id: item.id,
          quantity: item.quantity,
          product,
        };
      });
      const result = await Promise.all(fetches);
      setCartItems(result);
      setIsLoading(false);
    }

    loadCart();
  }, []);

  function updateQuantity(id, amount) {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.min(10, Math.max(1, item.quantity + amount));
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updated);
    const localCart = updated.map(({ id, quantity }) => ({ id, quantity }));
    localStorage.setItem('cart', JSON.stringify(localCart));
  }

  if (isLoading) return <p style={{ padding: '2rem' }}>Loading cart...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Shopping Cart</h1>
      {cartItems.map(({ id, quantity, product }) => (
        <div key={id} style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1.5rem',
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <img src={product.image} alt={product.title} style={{
            width: '100px',
            height: '100px',
            objectFit: 'contain'
          }} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.title}</h2>
            <p style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => updateQuantity(id, -1)} disabled={quantity <= 1}>−</button>
            <span>{quantity}</span>
            <button onClick={() => updateQuantity(id, +1)} disabled={quantity >= 10}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}