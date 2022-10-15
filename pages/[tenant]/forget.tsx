import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/App';
import { useApi } from '../../libs/useApi';
import { Tenant } from '../../types/Tenant';
import styles from '../../styles/Forget.module.css';
import Head from 'next/head';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Forget = (data: Props) => {
  const { tenant, setTenant } = useAppContext();

  useEffect(() => {
    setTenant(data.tenant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    router.push(`/${tenant?.slug}/forget-success`)
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Esqueci a senha | {tenant?.name}</title>
      </Head>

      <Header
        backColor={data.tenant.mainColor}
        backHref={`/${tenant?.slug}/login`}
      />

      <h1 className={styles.tenantName}>{tenant?.name}</h1>

      <h2 className={styles.title}>Esqueceu sua senha?</h2>

      <p
        className={styles.subtitle}
        style={{ borderBottomColor: tenant?.mainColor }}
      >
        Preencha o campo com seu e-mail e receba as instruções necessárias para
        redefinir a sua senha.
      </p>
      <hr className={styles.hr} />

      <div className={styles.formArea}>
        <div className={styles.inputEmail}>
          <InputField
            color={tenant?.mainColor}
            placeholder="Digite seu e-mail"
            value={email}
            onChange={setEmail}
          />
        </div>

        <div className={styles.signinButton}>
          <Button
            color={tenant?.mainColor}
            label="Enviar"
            onClick={handleSubmit}
            fill
          />
        </div>

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
