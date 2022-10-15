import React from 'react';
import styles from './styles.module.css';
import BackIcon from './backIcon.svg';
import Link from 'next/link';

type Props = {
  backHref: string;
  backColor: string | undefined;
  title?: string;
  invert?: boolean
};

const Header = ({ backColor, backHref, title, invert }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <Link href={backHref}>
          <a className={invert ? styles.buttonTransparent : ''}>
            <BackIcon color={invert ? '#FFF' : backColor} />
          </a>
        </Link>
      </div>
      {title && (
        <div 
          className={styles.centerSide}
          style={{color: invert ? '#FFF' : '#1B1B1B'}}
        >
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.rightSide}></div>
    </div>
  );
};

export default Header;
