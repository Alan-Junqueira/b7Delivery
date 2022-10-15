import React from 'react';
import styles from './styles.module.css';
import CartIcon from './cart.svg';
import ConfigIcon from './config.svg';
import FavoriteIcon from './favorite.svg';
import LogoutIcon from './logout.svg';
import MenuIcon from './menu.svg';
import OrdersIcon from './orders.svg';

type Props = {
  color: string;
  label: string;
  icon: 'cart' | 'config' | 'favorite' | 'logout' | 'orders' | 'menu';
  onClick: () => void;
  disabled?: boolean;
};

const SidebarMenuItem = ({ color, icon, label, onClick, disabled }: Props) => {
  return (
    <li className={styles.container} onClick={onClick}>
      {icon === 'cart' && <CartIcon color={color} />}
      {icon === 'config' && <ConfigIcon color={color} />}
      {icon === 'favorite' && <FavoriteIcon color={color} />}
      {icon === 'logout' && <LogoutIcon color={color} className={styles.logout}/>}
      {icon === 'menu' && <MenuIcon color={color} />}
      {icon === 'orders' && <OrdersIcon color={color} />}
      <span className={disabled ? styles.disabled : ''}>{label}</span>
    </li>
  );
};

export default SidebarMenuItem;
