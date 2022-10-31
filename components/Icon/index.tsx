import React from 'react';
import styles from './styles.module.css';

import MailSent from './mailSent.svg';

import { Location } from './Location';
import { ArrowRight } from './ArrowRight';
import { CardSymbleSvg } from './CardSymble';
import { CheckedSvg } from './Checked';
import { DescountSvg } from './Descount';
import { MoneySymbleSvg } from './MoneySymble';
import { Dots } from './Dots';

type Props = {
  icon: string;
  color: string | undefined;
  width?: number;
  height?: number;
};

const Icon = ({ color, height, icon, width }: Props) => {
  return (
    <div style={{ width, height }}>
      {icon === 'mailSent' && <MailSent color={color} />}
      {icon === 'card' && <CardSymbleSvg color={color} />}
      {icon === 'checked' && <CheckedSvg color={color} />}
      {icon === 'cupom' && <DescountSvg color={color} />}
      {icon === 'location' && <Location color={color} />}
      {icon === 'money' && <MoneySymbleSvg color={color} />}
      {icon === 'rightArrow' && <ArrowRight color={color} />}
      {icon === 'dots' && <Dots color={color} />}
    </div>
  );
};

export default Icon;
