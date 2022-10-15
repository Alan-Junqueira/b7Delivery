import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/App';
import { useApi } from '../../libs/useApi';
import { Tenant } from '../../types/Tenant';
import styles from '../../styles/Login.module.css';
import Head from 'next/head';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../contexts/auth';

const Login = (data: Props) => {
  const { tenant, setTenant } = useAppContext();
  const { setToken, setUser } = useAuthContext();

  useEffect(() => {
    setTenant(data.tenant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    setToken('1234')
    setUser({
      name: 'Alan',
      email: 'contato.alanjunqueira@gmail.com'
    })
    router.push(`/${tenant?.slug}`)
  };
  const handleSignup = () => {
    router.push(`/${tenant?.slug}/signup`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | {tenant?.name}</title>
      </Head>

      <Header backColor={data.tenant.mainColor} backHref={`/${tenant?.slug}`} />

      <h1 className={styles.tenantName}>{tenant?.name}</h1>

      <p
        className={styles.subtitle}
        style={{ borderBottomColor: tenant?.mainColor }}
      >
        Use suas credenciais para realizar o login.
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
            label="Entrar"
            onClick={handleSubmit}
            fill
          />
        </div>

        <p
          className={styles.forgetArea}
          style={{ borderBottomColor: tenant?.mainColor }}
        >
          Esqueceu sua senha?
          <Link href={`/${tenant?.slug}/forget`}>
            <a className={styles.link} style={{ color: tenant?.mainColor }}>
              Clique aqui
            </a>
          </Link>
        </p>
        <hr className={styles.hr} />

        <div className={styles.signupButton}>
          <Button
            color={tenant?.mainColor}
            label="Quero me cadastrar"
            onClick={handleSignup}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

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
