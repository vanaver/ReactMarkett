import React from 'react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        margin: '10px 0',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: 60,
          height: 60,
          objectFit: 'contain',
        }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600 }}>{product.title}</p>
        <p>Цена: ${product.price}</p>
        <p>Рейтинг: {product.rating?.rate ?? '—'}</p>
      </div>
    </div>
  );
};

export default ProductCard;
