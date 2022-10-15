import React, { useEffect, useState } from 'react';
import { useFormatter } from '../../libs/useFormatter';
import styles from './styles.module.css';

type Props = {
  color: string | undefined;
  count: number;
  onUpdateCount: (newCount: number) => void;
  min?: number;
  max?: number;
  small?: boolean;
};

const Quantity = ({ color, count, onUpdateCount, min, max, small }: Props) => {
  const formater = useFormatter();

  const [canRemove, setCanRemove] = useState(false);
  const [canAdd, setCanAdd] = useState(false);

  useEffect(() => {
    setCanRemove(!min || (min && count > min) ? true : false);
    setCanAdd(!max || (max && count < max) ? true : false);
  }, [count, min, max]);

  const handleRemove = () => {
    if (canRemove) {
      onUpdateCount(count - 1);
    }
  };
  const handleAdd = () => {
    if (canAdd) {
      onUpdateCount(count + 1);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleRemove}
        style={{
          color: canRemove ? '#FFF' : '#96A3AB',
          backgroundColor: canRemove ? color : '#F2F4F5',
          width: small ? 42 : 48,
          height: small ? 42 : 48
        }}
      >
        -
      </button>
      <p className={styles.quantity} style={{ fontSize: small ? 16 : 18 }}>
        {formater.formatQuantity(count, 2)}
      </p>
      <button
        className={styles.button}
        onClick={handleAdd}
        style={{
          color: canAdd ? '#FFF' : '#96A3AB',
          backgroundColor: canAdd ? color : '#F2F4F5',
          width: small ? 42 : 48,
          height: small ? 42 : 48
        }}
      >
        +
      </button>
    </div>
  );
};

export default Quantity;
