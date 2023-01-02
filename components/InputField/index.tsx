import React, { useState } from 'react';
import styles from './styles.module.css';
import EyeOff from './EyeOff.svg';
import EyeOn from './EyeOn.svg';

type Props = {
  color: string | undefined;
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void;
  password?: boolean;
  shipping?: boolean;
  id?: string;
  warning?: boolean;
};

const InputField = ({
  color,
  onChange,
  placeholder,
  value,
  password,
  shipping,
  id,
  warning
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={styles.container}
      style={{
        borderColor: warning ? '#FF0000' : focused ? color : '#F9F9FB',
        backgroundColor: focused ? '#FFFFFF' : '#F9F9FB',
        borderRadius: shipping ? '8px' : '4px'
      }}
    >
      <input
        type={password ? (showPassword ? 'text' : 'password') : 'text'}
        className={styles.input}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
        style={{}}
      />

      {password && (
        <div
          className={styles.showPassword}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword && <EyeOn color={color} />}
          {!showPassword && <EyeOff color={color} />}
        </div>
      )}
    </div>
  );
};

export default InputField;
