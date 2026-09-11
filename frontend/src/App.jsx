import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_GATEWAY = process.env.VITE_API_URL || 'http://localhost:8080';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // In a real app this goes to API_GATEWAY/api/products
    axios.get(`${API_GATEWAY}/api/products`).then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const addToCart = (productId) => {
    axios.post(`${API_GATEWAY}/api/cart`, { productId, quantity: 1, userId: 'user1' })
      .then(() => alert('Added to cart!'))
      .catch(console.error);
  };

  return (
    <div>
      <h2>Products</h2>
      <div className="product-list">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios.get(`${API_GATEWAY}/api/cart/user1`).then(res => setCartItems(res.data)).catch(console.error);
  }, []);

  const checkout = () => {
    axios.post(`${API_GATEWAY}/api/orders`, { userId: 'user1', totalAmount: 100 }) // simplify amount
      .then(() => {
        alert('Order placed!');
        axios.delete(`${API_GATEWAY}/api/cart/user1`);
        setCartItems([]);
      })
      .catch(console.error);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>Product ID: {item.productId} | Quantity: {item.quantity}</li>
        ))}
      </ul>
      {cartItems.length > 0 && <button onClick={checkout}>Checkout</button>}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_GATEWAY}/api/orders/user/user1`).then(res => setOrders(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>Order #{order.id} - Status: {order.status} - Total: ${order.totalAmount}</li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <h1>E-Commerce</h1>
          <ul>
            <li><Link to="/">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
