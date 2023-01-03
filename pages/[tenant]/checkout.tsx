import { GetServerSideProps } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

import { useAppContext } from '../../contexts/App';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Checkout.module.css';
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import Head from 'next/head';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useFormatter } from '../../libs/useFormatter';
import { CartItem } from '../../types/CartItem';
import { useRouter } from 'next/router';
import CartProductItem from '../../components/CartProductItem';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import { Address } from '../../types/Address';

const Checkout = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenant, setTenant, shippingAddress, shippingPrice } = useAppContext();

  const router = useRouter();
  const formatter = useFormatter();
  const api = useApi(data.tenant.slug);

  // Payment Method
  const [cardActive, setCardActive] = useState(false);
  const [moneyActive, setMoneyActive] = useState(true);

  const handleCardActive = () => {
    setCardActive(true);
    setMoneyActive(false);
  };

  const handleMoneyActive = () => {
    setCardActive(false);
    setMoneyActive(true);
  };

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    setUser(data.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Product Controll
  const [cart, setCart] = useState<CartItem[]>(data.cart);

  // Shipping

  const handleChangeAddress = () => {
    console.log(tenant);
    router.push(`/${tenant?.slug}/myaddresses`);
  };

  // Payments
  const [paymentMethod, setPaymentMethod] = useState<'money' | 'card'>('money');
  const [cashAdvanceValue, setCashAdvanceValue] = useState(0);

  // Cupom
  const [cupom, setCupom] = useState('');
  const [cupomDiscount, setCupomDiscount] = useState(0);
  const [cupomInput, setCupomInput] = useState('');

  const handleSetCupom = () => {
    if (cupomInput) {
      setCupom(cupomInput);
      setCupomDiscount(15.2);
    }
  };

  // resume
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    let sub = 0;
    for (let i in cart) {
      sub += cart[i].product.price * cart[i].quantity;
    }
    setSubtotal(sub);
  }, [cart]);

  const handleFinish = async () => {
    if (shippingAddress) {
      const order = await api.setOrder(
        shippingAddress,
        paymentMethod,
        cashAdvanceValue,
        cupom,
        data.cart
      );
      if (order) {
        router.push(`/${data.tenant.slug}/order/${order.id}`);
      } else {
        alert('Ocorreu um erro! Tente mais tarde!');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout | {tenant?.slug}</title>
      </Head>

      <Header
        title="Checkout"
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
            label={
              shippingAddress
                ? `${shippingAddress.street}, ${shippingAddress.number} - ${shippingAddress.district}`
                : 'Escolha um endereço'
            }
            onClick={handleChangeAddress}
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
            onClick={() => setPaymentMethod('money')}
            fill={paymentMethod === 'money'}
          />

          <ButtonWithIcon
            color={tenant?.mainColor}
            leftIcon={'card'}
            label={'Cartão'}
            onClick={() => setPaymentMethod('card')}
            fill={paymentMethod === 'card'}
          />
        </div>
      </div>

      {paymentMethod === 'money' && (
        <div className={styles.cashAdvance}>
          <p>Troco</p>
          <InputField
            color={tenant?.mainColor}
            placeholder="Quanto você tem em dinheiro?"
            value={cashAdvanceValue ? cashAdvanceValue.toString() : ''}
            onChange={(newValue) => setCashAdvanceValue(parseInt(newValue))}
          />
        </div>
      )}

      <div className={styles.discountCoupon}>
        <p>Cupom de desconto</p>
        {cupom && (
          <ButtonWithIcon
            color={tenant?.mainColor}
            leftIcon={'cupom'}
            rightIcon={'checked'}
            label={cupom.toUpperCase()}
            onClick={() => {}}
          />
        )}

        {!cupom && (
          <div className={styles.cupomInput}>
            <InputField
              color={tenant?.mainColor}
              placeholder="Tem um cupom?"
              value={cupomInput}
              onChange={(newValue) => setCupomInput(newValue)}
              shipping
            />
            <Button
              color={tenant?.mainColor}
              label="OK"
              onClick={handleSetCupom}
              shipping
            />
          </div>
        )}
      </div>

      <h3 className={styles.productsQuantity}>
        {cart.length} {cart.length === 1 ? 'item' : 'itens'}
      </h3>

      <ul className={styles.productsList}>
        {cart.map((cartItem, index) => (
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
          <span>{formatter.formatPrice(subtotal)}</span>
        </div>

        {cupomDiscount > 0 && (
          <div className={styles.resumeDiscount}>
            <p>Desconto</p>
            <span>- {formatter.formatPrice(cupomDiscount)}</span>
          </div>
        )}

        <div className={styles.resumeShipping}>
          <p>Frete</p>
          <span>
            {shippingPrice < 1 ? '--' : formatter.formatPrice(shippingPrice)}
          </span>
        </div>
        <div className={styles.resumeTotal}>
          <p>Total</p>
          <span style={{ color: tenant?.mainColor }}>
            {formatter.formatPrice(shippingPrice + subtotal - cupomDiscount)}
          </span>
        </div>

        <Button
          color={tenant?.mainColor}
          label="Finalizar Pedido"
          onClick={handleFinish}
          fill
          disabled={!shippingAddress}
        />
      </div>
    </div>
  );
};

export default Checkout;

type Props = {
  tenant: Tenant;
  token: string;
  user: User | null;
  cart: CartItem[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query;
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

  // GET Cart Products
  const cartCookie = getCookie('cart', context);

  const cart = await api.getCartProducts(cartCookie as string);

  return {
    props: {
      tenant,
      user,
      token,
      cart
    }
  };
};
