import React, { useEffect, useRef, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';

import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import CartProductItem from '../../../components/CartProductItem';
import ButtonWithIcon from '../../../components/ButtonWithIcon';

import { useAppContext } from '../../../contexts/App';
import { useAuthContext } from '../../../contexts/auth';

import { useApi } from '../../../libs/useApi';
import { useFormatter } from '../../../libs/useFormatter';

import { Product } from '../../../types/Product';
import { Tenant } from '../../../types/Tenant';
import { User } from '../../../types/User';
import { CartItem } from '../../../types/CartItem';
import { Address } from '../../../types/Address';

import styles from '../../../styles/Order-id.module.css';
import { Order } from '../../../types/Order';

const OrderId = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenant, setTenant } = useAppContext();

  const router = useRouter();
  const formatter = useFormatter();

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    setUser(data.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.order.status !== 'delivered') {
      setTimeout(() => {
        router.reload();
      }, 60000); //? 60seconds
    }
  }, []);

  const orderStatusList = {
    preparing: {
      label: 'Preparando',
      longLabel: 'Preparando o seu pedido...',
      backgroundColor: '#FEFAE6',
      fontColor: '#D4BC34',
      percentage: 25
    },
    sent: {
      label: 'Enviado',
      longLabel: 'Enviamos o seu pedido!',
      backgroundColor: '#F1F3F8',
      fontColor: '#758CBD',
      percentage: 75
    },
    delivered: {
      label: 'Entregue',
      longLabel: 'Seu pedido foi entregue',
      backgroundColor: '#F1F8F6',
      fontColor: '#6AB70A',
      percentage: 100
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {`Pedido ${data.order.id}`} | {tenant?.slug}
        </title>
      </Head>

      <Header
        title={`Pedido ${data.order.id}`}
        backColor={tenant?.mainColor}
        backHref={`/${tenant?.slug}`}
      />
      <div className={styles.lineHeader}></div>

      {data.order.status !== 'delivered' && (
        <div
          className={styles.statusArea}
          style={{
            backgroundColor: orderStatusList[data.order.status].backgroundColor,
            color: orderStatusList[data.order.status].fontColor
          }}
        >
          <h3 className={styles.statusLongLabel}>
            {orderStatusList[data.order.status].longLabel}
          </h3>
          <div className={styles.statusPercentage}>
            <div
              className={styles.statusPercentageBar}
              style={{
                width: `${orderStatusList[data.order.status].percentage}%`,
                backgroundColor: orderStatusList[data.order.status].fontColor
              }}
            ></div>
          </div>
          <span className={styles.statusMessage}>
            Aguardando mudança de status...
          </span>
        </div>
      )}

      <div className={styles.orderInfoArea}>
        <span
          className={styles.orderInfoStatus}
          style={{
            backgroundColor: orderStatusList[data.order.status].backgroundColor,
            color: orderStatusList[data.order.status].fontColor
          }}
        >
          {orderStatusList[data.order.status].label}
        </span>
        <span className={styles.orderInfoQuantity}>
          {data.order.products.length}
          {data.order.products.length === 1 ? ' item' : ' itens'}
        </span>
        <span className={styles.orderInfoDate}>
          {formatter.formatDate(data.order.orderDate)}
        </span>
      </div>

      <ul className={styles.productsList}>
        {data.order.products.map((cartItem, index) => (
          <CartProductItem
            key={index}
            color={tenant?.mainColor}
            quantity={cartItem.quantity}
            product={cartItem.product}
            onChange={() => {}}
            noEdit
          />
        ))}
      </ul>

      <div className={styles.address}>
        <label htmlFor="address">Endereço</label>
        <div id="address">
          <ButtonWithIcon
            color={tenant?.mainColor}
            leftIcon={'location'}
            rightIcon={'rightArrow'}
            label={`${data.order.shippingAddress.street}, ${data.order.shippingAddress.number} - ${data.order.shippingAddress.district}`}
            onClick={() => {}}
          />
        </div>
      </div>

      <div className={styles.paymentMethod}>
        <p>Tipo de Pagamento</p>
        <div className={styles.paymentMethods}>
          <ButtonWithIcon
            color={tenant?.mainColor}
            leftIcon={'money'}
            label={'Dinheiro'}
            onClick={() => {}}
            fill={data.order.paymentMethod === 'money'}
          />

          <ButtonWithIcon
            color={tenant?.mainColor}
            leftIcon={'card'}
            label={'Cartão'}
            onClick={() => {}}
            fill={data.order.paymentMethod === 'card'}
          />
        </div>
      </div>

      {data.order.paymentMethod === 'money' && (
        <div className={styles.cashAdvance}>
          <p>Troco</p>
          <InputField
            color={tenant?.mainColor}
            placeholder="Quanto você tem em dinheiro?"
            value={data.order.cashAdvanceValue?.toString() ?? ''}
            onChange={() => {}}
          />
        </div>
      )}

      {data.order.cupom && (
        <div className={styles.discountCoupon}>
          <p>Cupom de desconto</p>
          <ButtonWithIcon
            color={tenant?.mainColor}
            leftIcon={'cupom'}
            rightIcon={'checked'}
            label={data.order.cupom.toUpperCase()}
            onClick={() => {}}
          />
        </div>
      )}

      <div className={styles.resumeArea}>
        <div className={styles.resumeSubtotal}>
          <p>Subtotal</p>
          <span>{formatter.formatPrice(data.order.subtotal)}</span>
        </div>

        {data.order.cupomDiscount && (
          <div className={styles.resumeDiscount}>
            <p>Desconto</p>
            <span>- {formatter.formatPrice(data.order.cupomDiscount)}</span>
          </div>
        )}

        <div className={styles.resumeShipping}>
          <p>Frete</p>
          <span>
            {data.order.shippingPrice < 1
              ? '--'
              : formatter.formatPrice(data.order.shippingPrice)}
          </span>
        </div>
        <div className={styles.resumeTotal}>
          <p>Total</p>
          <span style={{ color: tenant?.mainColor }}>
            {formatter.formatPrice(data.order.total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderId;

type Props = {
  tenant: Tenant;
  token: string;
  user: User | null;
  order: Order;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug, orderid } = context.query;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi(tenantSlug as string);

  // Get Tenant
  const tenant = await api.getTenant();
  if (!tenant) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  // Get Logged user
  // const token = context.req.cookies.token
  const token = getCookie('token', context) ?? '';
  const user = await api.authorizeToken(token as string);

  // Get Order
  const order = await api.getOrder(parseInt(orderid as string));

  return {
    props: {
      tenant,
      user,
      token,
      order
    }
  };
};
