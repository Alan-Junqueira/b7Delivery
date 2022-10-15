import React, { KeyboardEvent, useState } from 'react';
import styles from './styles.module.css';
import SearchIcon from './search.svg';
import { useAppContext } from '../../contexts/App';

type Props = {
  onSearch: (searchValue: string) => void;
};

const SearchInput = ({ onSearch }: Props) => {
  const { tenant } = useAppContext();

  const [focused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    // if (event.code === 'Enter') {
      onSearch(searchValue);
    // }
  };

  return (
    <div
      className={styles.container}
      style={{ borderColor: focused ? tenant?.mainColor : '#FFFFFF' }}
    >
      <button className={styles.button} onClick={() => onSearch(searchValue)}>
        <SearchIcon color={tenant?.mainColor} />
      </button>
      <input
        type="text"
        className={styles.input}
        placeholder="Digite o nome do produto"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyUp={handleKeyUp}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
