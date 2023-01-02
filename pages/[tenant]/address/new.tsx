import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

import { useAuthContext } from '../../../contexts/auth';
import { useAppContext } from '../../../contexts/App';

import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { AddressItem } from '../../../components/AddressItem';

import { useFormatter } from '../../../libs/useFormatter';
import { useApi } from '../../../libs/useApi';

import { User } from '../../../types/User';
import { Tenant } from '../../../types/Tenant';
import { Address } from '../../../types/Address';
import { CartItem } from '../../../types/CartItem';

import styles from '../../../styles/NewAddress.module.css';

const NewAddress = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenant, setTenant, setShippingAddress, setShippingPrice } =
    useAppContext();

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    if (data.user) setUser(data.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();
  const formatter = useFormatter();
  const api = useApi(data.tenant.slug);

  const handleNewAddress = () => {
    router.push(`/${data.tenant.slug}/address/new`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Novo Endereço | {tenant?.slug}</title>
      </Head>

      <Header
        title="Novo Endereço"
        backColor={tenant?.mainColor}
        backHref={`/${tenant?.slug}/checkout`}
      />
      <div className={styles.lineHeader}></div>

      <div className={styles.btnArea}>
        <Button
          color={tenant?.mainColor}
          label="Adicionar"
          onClick={handleNewAddress}
          fill
        />
      </div>
    </div>
  );
};

export default NewAddress;

type Props = {
  tenant: Tenant;
  token: string;
  user: User | null;
  addresses: Address[];
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

  if (!user) {
    return {
      redirect: { destination: `${tenant.slug}/login`, permanent: false }
    };
  }

  // GET Addresses from logged User
  const addresses = await api.getUserAddresses(user.email);

  return {
    props: {
      tenant,
      user,
      token,
      addresses
    }
  };
};
