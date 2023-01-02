import { Address } from '../../types/Address';
import Icon from '../Icon';
import styles from './styles.module.css';

type Props = {
  iconColor: string | undefined;
  address: Address;
  onSelect: (address: Address) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  menuOpened: number;
  setMenuOpened: (id: number) => void;
};

const AddressItem = ({
  address,
  iconColor,
  onDelete,
  onEdit,
  onSelect,
  menuOpened,
  setMenuOpened
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.addressArea} onClick={() => onSelect(address)}>
        <Icon color={iconColor} icon="location" width={24} height={24} />
        <span className={styles.addressText}>
          {`${address.street} ${address.number}, ${address.city}`}
          {`${address.street} ${address.number}, ${address.city}`}
        </span>
      </div>
      <div className={styles.btnArea}>
        <div
          className={styles.menuIcon}
          onClick={() => setMenuOpened(address.id)}
        >
          <Icon color="#6A7D8B" icon="dots" width={24} height={24} />
        </div>
        {menuOpened === address.id && (
          <div className={styles.popup}>
            <div
              className={styles.popupItem}
              onClick={() => onEdit(address.id)}
            >
              <Icon color="#96A3AB" icon="edit" width={24} height={24} />
              <span className={styles.popupText}>Editar</span>
            </div>
            <div
              className={styles.popupItem}
              onClick={() => onDelete(address.id)}
            >
              <Icon color="#96A3AB" icon="delete" width={24} height={24} />
              <span className={styles.popupText}>Deletar</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { AddressItem };
