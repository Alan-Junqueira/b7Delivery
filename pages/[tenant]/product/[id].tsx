/* eslint-disable @next/next/no-img-element */
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import Header from '../../../components/Header';
import Quantity from '../../../components/Quantity';
import { useAppContext } from '../../../contexts/App';

import { useApi } from '../../../libs/useApi';
import { useFormatter } from '../../../libs/useFormatter';

import styles from '../../../styles/Product-id.module.css';

import { CartCookie } from '../../../types/CartCookie';
import { Product } from '../../../types/Product';
import { Tenant } from '../../../types/Tenant';

const Product = (data: Props) => {
  const { tenant, setTenant } = useAppContext();
  const formater = useFormatter();
  const router = useRouter()

  useEffect(() => {
    setTenant(data.tenant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [qtCount, setQtCount] = useState(1);

  const handleAddToCart = () => {
    let cart:CartCookie[] = []

    // Create or get an existing cart
    if(hasCookie('cart')){
      const cartCookie = getCookie('cart')
      const cartJson:CartCookie[] = JSON.parse(cartCookie as string)

      for(let i in cartJson){
        if(cartJson[i].quantity && cartJson[i].id){
          cart.push(cartJson[i])
        }
      }
    }

    // Search product in cart
    const cartIndex = cart.findIndex(item => item.id === data.product.id)
    if(cartIndex > -1){
      cart[cartIndex].quantity += qtCount
    }else {
      cart.push({id: data.product.id, quantity: qtCount})
    }

    // Setting cookie
    setCookie('cart', JSON.stringify(cart))

    // Going to cart
    router.push(`/${tenant?.slug}/cart`)
  };

  const handleUpdateQt = (newCount: number) => {
    setQtCount(newCount);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {data.product.productName} | {data.tenant.name}
        </title>
      </Head>

      <div className={styles.headerArea}>
        <Header
          backColor={tenant?.mainColor}
          backHref={`/${tenant?.slug}`}
          title="Produto"
          invert
        />
      </div>

      <div
        className={styles.headerBg}
        style={{ backgroundColor: tenant?.mainColor }}
      ></div>

      <div className={styles.productImage}>
        <img src={data.product.image} alt="" />
      </div>

      <section className={styles.section}>
        <p className={styles.category}>{data.product.categoryName}</p>
        <h1
          className={styles.title}
          style={{ borderBottomColor: tenant?.mainColor }}
        >
          {data.product.productName}
        </h1>
        <hr />
        <p className={styles.description}>{data.product.description}</p>
        <p className={styles.qtText}>Quantidade</p>
        <div className={styles.qtArea}>
          <div className={styles.qtAreaLeft}>
            <Quantity
              color={tenant?.mainColor}
              count={qtCount}
              onUpdateCount={handleUpdateQt}
              min={1}
            />
          </div>
          <p
            className={styles.qtAreaRight}
            style={{ color: tenant?.mainColor }}
          >
            {formater.formatPrice(data.product.price)}
          </p>
        </div>
        <Button
          fill
          color={tenant?.mainColor}
          label="Adicionar à sacola"
          onClick={handleAddToCart}
        />
      </section>
    </div>
  );
};

export default Product;

type Props = {
  tenant: Tenant;
  product: Product;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug, id } = context.query;
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

  // Get product
  const product = await api.getProduct(parseInt(id as string));

  return {
    props: {
      tenant,
      product
    }
  };
};
