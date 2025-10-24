// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  loadProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  setSortOrder,
} from './productsReducer';
import type { AppDispatch } from './store';
import AddProductForm from './components/AddProductForm';
import ProductDetails from './pages/ProductDetails';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: 20 }}>
              <h1>Список товаров</h1>

              {/* Панель управления */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                {!isAdding ? (
                  <button onClick={() => setIsAdding(true)}>Добавить товар</button>
                ) : (
                  <AddProductForm onClose={() => setIsAdding(false)} />
                )}

                {/* Кнопки сортировки */}
                <select
                  onChange={(e) =>
                    dispatch(setSortOrder(e.target.value as 'price-asc' | 'price-desc' | 'rating-desc' | null))
                  }
                  defaultValue=""
                >
                  <option value="">Сортировка</option>
                  <option value="price-asc">Цена ↑</option>
                  <option value="price-desc">Цена ↓</option>
                  <option value="rating-desc">По рейтингу</option>
                </select>
              </div>

              {/* Список товаров */}
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    style={{
                      border: '1px solid #ddd',
                      marginBottom: 10,
                      padding: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <img src={p.image} alt={p.title} width={50} height={50} style={{ objectFit: 'contain' }} />
                    <div>
                      <p>{p.title}</p>
                      <p>Цена: ${p.price}</p>
                      {p.rating && <p>Рейтинг: {p.rating.rate}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
