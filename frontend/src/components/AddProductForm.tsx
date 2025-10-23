import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../productsReducer';
import type { AppDispatch } from '../store';

const AddProductForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !image || !category) {
      alert('Заполни все обязательные поля!');
      return;
    }

    dispatch(
      addProduct({
        title,
        price: Number(price),
        description,
        image,
        category,
        rating: { rate: 0, count: 0 },
      })
    );

    onClose(); // закрываем форму
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <h3>Добавить товар</h3>

      <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Цена" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="URL картинки" value={image} onChange={(e) => setImage(e.target.value)} />
      <input placeholder="Категория" value={category} onChange={(e) => setCategory(e.target.value)} />
      <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />

      <button type="submit">Добавить</button>
      <button type="button" onClick={onClose}>Отмена</button>
    </form>
  );
};

export default AddProductForm;
