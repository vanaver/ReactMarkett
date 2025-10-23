import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts, selectProducts, selectProductsLoading, selectProductsError } from './productsReducer';
import type { AppDispatch } from './store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(loadProducts()); // при монтировании — загружаем товары
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Список товаров</h1>
      {products.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: 10 }}>
          <img src={p.image} alt={p.title} style={{ width: 50, height: 50, objectFit: 'contain' }} />
          <p>{p.title}</p>
          <p>Цена: ${p.price}</p>
          <p>Рейтинг: {p.rating?.rate}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
