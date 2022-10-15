import Link from 'next/link';
import React from 'react';
import { useAppContext } from '../../contexts/App';
import { useFormatter } from '../../libs/useFormatter';
import { Product } from '../../types/Product';
import styles from './styles.module.css';

type Props = {
  data: Product;
};

const ProductItem = ({ data }: Props) => {
  const { tenant } = useAppContext();
  const formater = useFormatter();

  return (
    <Link href={`/${tenant?.slug}/product/${data.id}`}>
      <a
        className={styles.container}
        style={{
          backgroundImage: `linear-gradient( ${tenant?.secondColor}, ${tenant?.secondColor}, ${tenant?.secondColor}, #ffffff, #ffffff,  #FFFFFF)`
        }}
      >
        <img src={data.image} alt="" className={styles.image} />
        <p className={styles.category}>{data.categoryName}</p>
        <h2 className={styles.productName}>{data.productName}</h2>
        <h3 className={styles.price} style={{ color: tenant?.mainColor }}>
          {formater.formatPrice(data.price)}
        </h3>
      </a>
    </Link>
  );
};

export default ProductItem;
