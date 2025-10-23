import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts, selectProducts, selectProductsLoading, selectProductsError } from './productsReducer';
import type { AppDispatch } from './store';
import ProductCard from './components/ProductCard';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(loadProducts()); 
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Список товаров</h1>
{products.map((p) => (
  <ProductCard key={p.id} product={p} />
))}

    </div>
  );
};

export default App;
