import { Address } from '../../types/Address';
import Icon from '../Icon';
import styles from './styles.module.css';

type Props = {
  iconColor: string | undefined;
  address: Address;
  onSelect: (address: Address) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const AddressItem = ({
  address,
  iconColor,
  onDelete,
  onEdit,
  onSelect
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.addressArea}>
        <Icon color={iconColor} icon="location" width={24} height={24} />
        <span
          className={styles.addressText}
        >{`${address.street} ${address.number}, ${address.city}`}</span>
      </div>
      <div className={styles.btnArea}>
        <div className={styles.menuIcon}>
          <Icon color="#6A7D8B" icon="dots" width={24} height={24} />
        </div>
        
      </div>
    </div>
  );
};

export { AddressItem };
