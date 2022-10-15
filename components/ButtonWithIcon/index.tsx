import styles from './styles.module.css';

import React from 'react';
import Icon from '../Icon';

type Props = {
  color: string | undefined;
  leftIcon?: string;
  rightIcon?: string;
  label: string;
  onClick?: () => void;
  fill?: boolean;
};

const ButtonWithIcon = ({
  color,
  fill,
  label,
  leftIcon,
  onClick,
  rightIcon
}: Props) => {
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: fill ? color : '#F9F9FB' }}
      onClick={onClick}
    >
      {leftIcon && (
        <div
          className={styles.leftSide}
          style={{ backgroundColor: fill ? 'rgba(0, 0, 0, .05' : '#FFF' }}
        >
          <Icon color={fill ? '#FFF' : color} icon={leftIcon} />
        </div>
      )}
      <div
        className={styles.label}
        style={{ color: fill ? '#FFF' : '#1B1B1B' }}
      >
        {label}
      </div>
      {rightIcon && (
        <div
          className={styles.rightSide}
          style={{ backgroundColor: fill ? 'rgba(0, 0, 0, .05' : '' }}
        >
          <Icon color={color} icon={rightIcon} />
        </div>
      )}
    </div>
  );
};

export default ButtonWithIcon;
