import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  setSortOrder,
} from './productsReducer';
import type { AppDispatch } from './store';
import ProductCard from './components/ProductCard';
import AddProductForm from './components/AddProductForm';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'price-asc' | 'price-desc' | 'rating-desc' | null;
    dispatch(setSortOrder(value));
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Список товаров</h1>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="sort">Сортировать по: </label>
        <select id="sort" onChange={handleSortChange} defaultValue="">
          <option value="">— без сортировки —</option>
          <option value="price-asc">Цене (возрастание)</option>
          <option value="price-desc">Цене (убывание)</option>
          <option value="rating-desc">Рейтингу</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        {!isAdding ? (
          <button onClick={() => setIsAdding(true)}>Добавить товар</button>
        ) : (
          <AddProductForm onClose={() => setIsAdding(false)} />
        )}
      </div>

      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default App;
