import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts, updateProduct, deleteProduct } from '../productsReducer';
import type { AppDispatch } from '../store';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useSelector(selectProducts).find((p) => p.id === Number(id));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [title, setTitle] = useState(product?.title ?? '');
  const [price, setPrice] = useState(product?.price ?? 0);

  if (!product) return <p>Товар не найден</p>;

  const handleSave = () => {
    dispatch(updateProduct({ ...product, title, price }));
    alert('Изменения сохранены');
  };

  const handleDelete = () => {
    dispatch(deleteProduct(product.id));
    alert('Товар удалён');
    navigate('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate('/')}>← Назад</button>
      <h2>{product.title}</h2>
      <img src={product.image} alt={product.title} style={{ width: 150, height: 150 }} />
      <p>Категория: {product.category}</p>
      <p>Описание: {product.description}</p>
      <p>Рейтинг: {product.rating?.rate}</p>

      <hr />
      <h3>Редактирование</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" />
        <input value={price} type="number" onChange={(e) => setPrice(Number(e.target.value))} placeholder="Цена" />
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={handleDelete} style={{ background: 'red', color: 'white' }}>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
