import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/App';
import { useApi } from '../../libs/useApi';
import { Tenant } from '../../types/Tenant';
import styles from '../../styles/ForgetSuccess.module.css';
import Head from 'next/head';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useRouter } from 'next/router';
import Icon from '../../components/Icon';

const Forget = (data: Props) => {
  const { tenant, setTenant } = useAppContext();

  useEffect(() => {
    setTenant(data.tenant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/${tenant?.slug}/login`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Esqueci a senha | {tenant?.name}</title>
      </Head>

      <Header
        backColor={data.tenant.mainColor}
        backHref={`/${tenant?.slug}/forget`}
      />

      <div className={styles.iconArea}>
        <Icon
          icon="mailSent"
          color={tenant?.mainColor}
          width={110}
          height={110}
        />
      </div>

      <h2 className={styles.title}>Verifique seu e-mail</h2>

      <p className={styles.subtitle}>
        Enviamos as instruções para recuperação de senha para o seu e-mail.
      </p>

      <div className={styles.signinButton}>
        <Button
          color={tenant?.mainColor}
          label="Fazer Login"
          onClick={handleSubmit}
          fill
        />
      </div>
    </div>
  );
};

export default Forget;

type Props = {
  tenant: Tenant;
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

  return {
    props: {
      tenant
    }
  };
};
