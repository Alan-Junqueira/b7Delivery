import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

import { useAuthContext } from '../../contexts/auth';
import { useAppContext } from '../../contexts/App';

import Header from '../../components/Header';

import { useFormatter } from '../../libs/useFormatter';
import { useApi } from '../../libs/useApi';

import { User } from '../../types/User';
import { Tenant } from '../../types/Tenant';
import { CartItem } from '../../types/CartItem';

import styles from '../../styles/MyAddresses.module.css';
import Button from '../../components/Button';
import { Address } from '../../types/Address';
import { AddressItem } from '../../components/AddressItem';

const MyAddresses = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenant, setTenant } = useAppContext();

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    if (data.user) setUser(data.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();
  const formatter = useFormatter();

  const handleNewAddress = () => {
    router.push(`/${tenant?.slug}/newaddress`);
  };

  const handleAddressSelect = (address: Address) => {

  };
  const handleAddressEdit = (id: number) => {

  };
  const handleAddressDelete = (id: number) => {

  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Meus Endereços | {tenant?.slug}</title>
      </Head>

      <Header
        title="Meus Endereços"
        backColor={tenant?.mainColor}
        backHref={`/${tenant?.slug}/checkout`}
      />
      <div className={styles.lineHeader}></div>

      <ul className={styles.list}>
        {data.addresses.map((address, index) => (
          <AddressItem
            key={index}
            iconColor={tenant?.mainColor}
            address={address}
            onSelect={handleAddressSelect}
            onEdit={handleAddressEdit}
            onDelete={handleAddressDelete}
          />
        ))}
      </ul>

      <div className={styles.btnArea}>
        <Button
          color={tenant?.mainColor}
          label="Novo Endereço"
          onClick={handleNewAddress}
          fill
        />
      </div>
    </div>
  );
};

export default MyAddresses;

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
    return { redirect: { destination: '/login', permanent: false } };
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
