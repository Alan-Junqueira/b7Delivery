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

      <h3 className={styles.productsQuantity}>
        {data.order.products.length}
        {data.order.products.length === 1 ? 'item' : 'itens'}
      </h3>

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
