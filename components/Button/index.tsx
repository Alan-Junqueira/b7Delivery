import Link from 'next/link';
import React from 'react'
import styles from './styles.module.css'

type Props = {
  color: string | undefined;
  label: string;
  onClick: () => void;
  fill?: boolean,
  shipping?: boolean;
  disabled?: boolean;
}

const Button = ({color, label, onClick, fill, shipping, disabled}: Props) => {
  return (
    <button 
      className={styles.container}
      onClick={!disabled ? onClick : () => {}}
      style={{
        color: fill ? '#FFFFFF' : color,
        borderColor: color,
        backgroundColor: fill ? color : 'transparent',
        border: shipping ? `2px solid ${color}` : `1px solid ${color}`,
        padding: shipping ? '18px' : '22px',
        maxWidth: shipping ? '60px' : '100%',
        borderRadius: shipping ? '8px' : '4px',
        opacity: disabled ? '.4' : '1',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {label}
    </button>
  )
}

export default Button