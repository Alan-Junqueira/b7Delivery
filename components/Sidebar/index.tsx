import React from 'react';
import { useAuthContext } from '../../contexts/auth';
import { Tenant } from '../../types/Tenant';
import Button from '../Button';
import styles from './styles.module.css';
import CloseIcon from './close.svg';
import SidebarMenuItem from '../SidebarMenuItem';
import { useRouter } from 'next/router';

type Props = {
  tenant: Tenant | null;
  open: boolean;
  onClose: () => void;
};

const SideBar = ({ tenant, open, onClose }: Props) => {
  const { user, setToken } = useAuthContext();

  const router = useRouter();

  return (
    <div className={styles.container} style={{ width: open ? '100vw' : 0 }}>
      <div className={styles.area}>
        <header className={styles.header}>
          <div
            className={styles.loginArea}
            style={{ borderBottomColor: tenant?.mainColor }}
          >
            {user && (
              <>
                <strong>{user.name}</strong>

                <p>Ultimo pedido há x semanas</p>
              </>
            )}
            {!user && (
              <Button
                color={tenant?.mainColor}
                label="Fazer Login"
                onClick={() => router.push(`/${tenant?.slug}/login`)}
                fill
              />
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon style={{ color: tenant?.mainColor }} />
          </button>
        </header>
        <hr />
        <ul className={styles.menu}>
          <SidebarMenuItem
            color="#6A7D8B"
            icon="menu"
            label="Cardápio"
            onClick={onClose}
          />

          <SidebarMenuItem
            color="#6A7D8B"
            icon="cart"
            label="Sacola"
            onClick={() => router.push(`/${tenant?.slug}/cart`)}
          />

          <SidebarMenuItem
            color="#6A7D8B"
            icon="favorite"
            label="Favoritos"
            onClick={() => {}}
            disabled
          />

          <SidebarMenuItem
            color="#6A7D8B"
            icon="orders"
            label="Meus Pedidos"
            onClick={() => router.push(`/${tenant?.slug}/orders`)}
          />

          <SidebarMenuItem
            color="#6A7D8B"
            icon="config"
            label="Configurações"
            onClick={() => {}}
            disabled
          />
          {user && (
            <SidebarMenuItem
              color="#6A7D8B"
              icon="logout"
              label="Sair"
              onClick={() => {
                setToken('');
                onClose();
              }}
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
