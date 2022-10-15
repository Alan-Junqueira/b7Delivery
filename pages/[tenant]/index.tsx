import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

import Banner from '../../components/Banner';
import ProductItem from '../../components/ProductItem';
import SearchInput from '../../components/SearchInput';
import SideBar from '../../components/Sidebar';
import { useAppContext } from '../../contexts/App';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Home.module.css';
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import { Unfounded } from '../../components/Transformed/Unfounded';

const Home = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenant, setTenant } = useAppContext();

  useEffect(() => {
    setTenant(data.tenant);
    setToken(data.token);
    setUser(data.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [products, setProducts] = useState<Product[]>(data.products);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue);
  };

  useEffect(() => {
    let newFilteredProductList = [];
    for (let product of data.products) {
      if (
        product.productName.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      ) {
        newFilteredProductList.push(product);
      }
    }
    setFilteredProducts(newFilteredProductList);
  }, [searchText]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <h1 className={styles.headerTitle}>Seja Bem-Vindo 👋</h1>
            <p className={styles.headerSubtitle}>O que deseja pra hoje?</p>
          </div>

          <div className={styles.headerTopRight}>
            <div
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
            >
              <div
                className={styles.menuButtonLine}
                style={{ backgroundColor: tenant?.mainColor }}
              ></div>
              <div
                className={styles.menuButtonLine}
                style={{ backgroundColor: tenant?.mainColor }}
              ></div>
              <div
                className={styles.menuButtonLine}
                style={{ backgroundColor: tenant?.mainColor }}
              ></div>
            </div>

            <SideBar
              tenant={tenant}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>

        <div className={styles.headerBotton}>
          <SearchInput onSearch={handleSearch} />
        </div>
      </header>

      {!searchText && (
        <>
          <Banner />

          <div className={styles.grid}>
            {products.map((product, index) => (
              <ProductItem key={index} data={product} />
            ))}
          </div>
        </>
      )}

      {searchText && (
        <>
          <p className={styles.searchingFor}>
            Procurando por: <strong>{searchText}</strong>
          </p>

          {filteredProducts.length > 0 && (
            <div className={styles.grid}>
              {products.map((product, index) => (
                <ProductItem key={index} data={product} />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className={styles.noProducts}>
              <Unfounded color='#E0E0E0'/>
              <p className={styles.noProductsText}>
                Ops! Não há itens <br /> com este nome
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

type Props = {
  tenant: Tenant;
  products: Product[];
  token: string;
  user: User | null;
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

  // Get products
  const products = await api.getAllProducts();

  return {
    props: {
      tenant,
      products,
      user,
      token
    }
  };
};
