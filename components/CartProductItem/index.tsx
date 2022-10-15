/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useFormatter } from '../../libs/useFormatter';
import { Product } from '../../types/Product';
import Quantity from '../Quantity';
import styles from './styles.module.css';

type Props = {
  color: string | undefined;
  quantity: number;
  product: Product;
  onChange: (newCount: number, id: number) => void;
  noEdit?: boolean;
};

const CartProductItem = ({
  color,
  onChange,
  product,
  quantity,
  noEdit
}: Props) => {
  const formatter = useFormatter();

  return (
    <li className={styles.container}>
      <div className={styles.productImage}>
        <img src={product.image} alt="" />
      </div>
      <div className={styles.productInfo}>
        <p className={styles.categoryName}>{product.categoryName}</p>
        <h3 className={styles.productName}>{product.productName}</h3>
        <span style={{ color }} className={styles.productPrice}>
          {formatter.formatPrice(product.price)}
        </span>
      </div>
      <div className={styles.quantityControl}>
        {noEdit && (
          <div className={styles.quantityArea} style={{ color }}>
            <p className={styles.quantityTitle}>Qnt.</p>
            <p className={styles.quantityCount}>
              {formatter.formatQuantity(quantity, 2)}
            </p>
          </div>
        )}

        {!noEdit && (
          <Quantity
            color={color}
            count={quantity}
            onUpdateCount={(newCount: number) => onChange(newCount, product.id)}
            min={0}
            small
          />
        )}
      </div>
    </li>
  );
};

export default CartProductItem;
