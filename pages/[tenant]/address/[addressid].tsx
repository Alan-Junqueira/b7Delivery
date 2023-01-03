import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

import { useAuthContext } from '../../../contexts/auth';
import { useAppContext } from '../../../contexts/App';

import Header from '../../../components/Header';
import Button from '../../../components/Button';
import InputField from '../../../components/InputField';

import { useFormatter } from '../../../libs/useFormatter';
import { useApi } from '../../../libs/useApi';

import { User } from '../../../types/User';
import { Tenant } from '../../../types/Tenant';
import { Address } from '../../../types/Address';

import styles from '../../../styles/NewAddress.module.css';

const EditAddress = (data: Props) => {
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

  const [errorFields, setErrorFields] = useState<string[]>([]);

  const [address, setAddress] = useState<Address>(data.address);

  const changeAddressField = (
    field: keyof Address,
    value: typeof address[keyof Address]
  ) => {
    setAddress({ ...address, [field]: value });
  };

  const verifyAddress = () => {
    let newErrorFields = [];
    let approved = true;

    //? /[^0-9]/g
    //TODO: Remove o que não é número.
    if (address.cep.replaceAll(/[^0-9]/g, '').length !== 8) {
      newErrorFields.push('cep');
      approved = false;
    }

    if (address.street.length <= 2) {
      newErrorFields.push('street');
      approved = false;
    }

    if (address.district.length <= 2) {
      newErrorFields.push('district');
      approved = false;
    }

    if (address.city.length <= 2) {
      newErrorFields.push('city');
      approved = false;
    }

    if (address.state.length !== 2) {
      newErrorFields.push('state');
      approved = false;
    }

    setErrorFields(newErrorFields);

    return approved;
  };

  const handleUpdateAddress = async () => {
    if (verifyAddress()) {
      await api.editUserAddress(address);
      router.push(`/${data.tenant.slug}/myaddresses`);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Editar Endereço | {tenant?.slug}</title>
      </Head>

      <Header
        title="Editar Endereço"
        backColor={tenant?.mainColor}
        backHref={`/${tenant?.slug}/myaddresses`}
      />
      <div className={styles.lineHeader}></div>

      <form action="" className={styles.inputs}>
        <div className={styles.row}>
          <div className={styles.column}>
            <label htmlFor="addressCep">CEP</label>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite um CEP"
              id="addressCep"
              value={address.cep}
              onChange={(value) => changeAddressField('cep', value)}
              warning={errorFields.includes('cep')}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <label htmlFor="addressStreet">Rua</label>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite uma rua"
              id="addressStreet"
              value={address.street}
              onChange={(value) => changeAddressField('street', value)}
              warning={errorFields.includes('street')}
            />
          </div>

          <div className={styles.column}>
            <label htmlFor="addressNumber">Número</label>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite um número"
              id="addressNumber"
              value={address.number}
              onChange={(value) => changeAddressField('number', value)}
              warning={errorFields.includes('number')}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <label htmlFor="addressDistrict">Bairro</label>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite um bairro"
              id="addressDistrict"
              value={address.district}
              onChange={(value) => changeAddressField('district', value)}
              warning={errorFields.includes('district')}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <label htmlFor="addressCity">Cidade</label>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite uma cidade"
              id="addressCity"
              value={address.city}
              onChange={(value) => changeAddressField('city', value)}
              warning={errorFields.includes('city')}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <label htmlFor="addressState">Estado</label>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite um estado"
              id="addressState"
              value={address.state}
              onChange={(value) => changeAddressField('state', value)}
              warning={errorFields.includes('state')}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <label htmlFor="addressComplement">Complemento</label>
            <InputField
              color={data.tenant.mainColor}
              placeholder="Digite um complemento"
              id="addressComplement"
              value={address.complement ?? ''}
              onChange={(value) => changeAddressField('complement', value)}
              warning={errorFields.includes('complement')}
            />
          </div>
        </div>
      </form>

      <div className={styles.btnArea}>
        <Button
          color={tenant?.mainColor}
          label="Atualizar"
          onClick={handleUpdateAddress}
          fill
        />
      </div>
    </div>
  );
};

export default EditAddress;

type Props = {
  tenant: Tenant;
  token: string;
  user: User | null;
  address: Address;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug, addressid } = context.query;
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

  // GET Addresses
  const address = await api.getUserAddress(parseInt(addressid as string));

  if (!address) {
    return {
      redirect: { destination: `/myaddresses`, permanent: false }
    };
  }

  return {
    props: {
      tenant,
      user,
      token,
      address
    }
  };
};
