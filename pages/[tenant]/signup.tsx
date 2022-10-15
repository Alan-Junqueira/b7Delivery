import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/App';
import { useApi } from '../../libs/useApi';
import { Tenant } from '../../types/Tenant';
import styles from '../../styles/Signup.module.css';
import Head from 'next/head';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SignUp = (data: Props) => {
  const { tenant, setTenant } = useAppContext();

  useEffect(() => {
    setTenant(data.tenant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {};
  const handleSignup = () => {
    router.push(`/${tenant?.slug}/signup`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Cadastro | {tenant?.name}</title>
      </Head>

      <Header backColor={data.tenant.mainColor} backHref={`/${tenant?.slug}/login`} />

      <h1 className={styles.tenantName}>{tenant?.name}</h1>

      <p
        className={styles.subtitle}
        style={{ borderBottomColor: tenant?.mainColor }}
      >
        Preencha os campos para criar o seu cadastro.
      </p>
      <hr className={styles.hr} />

      <div className={styles.formArea}>
        <div className={styles.inputName}>
          <InputField
            color={tenant?.mainColor}
            placeholder="Digite seu nome"
            value={name}
            onChange={setName}
          />
        </div>

        <div className={styles.inputEmail}>
          <InputField
            color={tenant?.mainColor}
            placeholder="Digite seu e-mail"
            value={email}
            onChange={setEmail}
          />
        </div>
        <div className={styles.inputPassword}>
          <InputField
            color={tenant?.mainColor}
            placeholder="Digite sua senha"
            value={password}
            onChange={setPassword}
            password
          />
        </div>
        <div className={styles.signinButton}>
          <Button
            color={tenant?.mainColor}
            label="Cadastrar"
            onClick={handleSubmit}
            fill
          />
        </div>

        <p className={styles.forgetArea}>
          Já tem cadastro?
          <Link href={`/${tenant?.slug}/login`}>
            <a className={styles.link} style={{ color: tenant?.mainColor }}>
              Fazer Login
            </a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

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
