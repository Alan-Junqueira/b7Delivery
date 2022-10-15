import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

import { useAppContext } from '../../contexts/App';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Cart.module.css';
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

const Cart = (data: Props) => {
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

  // Product Controll
  const [cart, setCart] = useState<CartItem[]>(data.cart);

  const handleCartChange = (newCount: number, id: number) => {
    const temporaryCart: CartItem[] = [...cart];
    const cartIndex = temporaryCart.findIndex((item) => item.product.id === id);

    if (newCount > 0) {
      temporaryCart[cartIndex].quantity = newCount;
    } else {
      delete temporaryCart[cartIndex];
    }

    let newCart: CartItem[] = temporaryCart.filter((item) => item);
    setCart(newCart);

    // Update Cookie
    let cartCookie = [];
    for (let i in newCart) {
      cartCookie.push({
        id: newCart[i].product.id,
        quantity: newCart[i].quantity
      });
    }

    setCookie('cart', JSON.stringify(cartCookie));
  };

  // Shipping
  const [shippingInput, setShippingInput] = useState('');
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingTime, setShippingTime] = useState(0);
  const [shippingAddress, setShippingAddress] = useState('');

  const handleShippingCalc = () => {
    setShippingAddress('Rua das Flores - Jardins da Serra - Campina Pequena');
    setShippingPrice(9.5);
    setShippingTime(20);
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

  const handleFinish = () => {
    router.push(`/${tenant?.slug}/checkout`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sacola | {tenant?.slug}</title>
      </Head>

      <Header
        title="Sacola"
        backColor={tenant?.mainColor}
        backHref={`/${tenant?.slug}`}
      />

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
            onChange={handleCartChange}
          />
        ))}
      </ul>

      <div className={styles.shippingArea}>
        <p className={styles.shippingTitle}>Calcular frete e prazo</p>
        <div className={styles.shippingForm}>
          <InputField
            color={tenant?.mainColor}
            placeholder="Digite seu CEP"
            value={shippingInput}
            onChange={setShippingInput}
            shipping
          />

          <Button
            color={tenant?.mainColor}
            label="OK"
            onClick={handleShippingCalc}
            shipping
          />
        </div>

        {shippingTime > 0 && (
          <div className={styles.shippingInfo}>
            <span className={styles.shippingStreet}>{shippingAddress}</span>
            <div className={styles.shippingTimePrice}>
              <h3 className={styles.shippingTime}>
                Receba em até {shippingTime} minutos
              </h3>
              <h4
                className={styles.shippingPrice}
                style={{ color: tenant?.mainColor }}
              >
                {formatter.formatPrice(shippingPrice)}
              </h4>
            </div>
          </div>
        )}
      </div>

      <div className={styles.resumeArea}>
        <div className={styles.resumeSubtotal}>
          <p>Subtotal</p>
          <span>{formatter.formatPrice(subtotal)}</span>
        </div>

        <div className={styles.resumeShipping}>
          <p>Frete</p>
          <span>
            {shippingPrice < 1 ? '--' : formatter.formatPrice(shippingPrice)}
          </span>
        </div>
        <div className={styles.resumeTotal}>
          <p>Total</p>
          <span style={{ color: tenant?.mainColor }}>
            {formatter.formatPrice(shippingPrice + subtotal)}
          </span>
        </div>

        <Button
          color={tenant?.mainColor}
          label="Continuar"
          onClick={handleFinish}
          fill
        />
      </div>
    </div>
  );
};

export default Cart;

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
