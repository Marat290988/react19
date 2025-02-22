import './App.css';
import '@mantine/core/styles.css';
import { Loader, MantineProvider } from '@mantine/core';
import { Main } from './pages/main/main';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import ProductPage from './pages/products/product-page';
import { Auth } from './pages/auth/auth';
import { useAuthStore } from './store/auth.store';
import { useEffect, useState } from 'react';
import { useLoadingStore } from './store/loading.store';
import { ProductService } from './api/product';
import useProductStore from './store/product.store';
import { Path } from './shared/model/path.enum';
import { ClientPage } from './pages/clients/client-page';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { ClientsService } from './api/clients';
import useClientStore from './store/client.store';
import { PreOrders } from './pages/pre-orders/pre-orders';
import { Orders } from './pages/orders/orders';

function App() {

  const { validateToken } = useAuthStore();
  const { isLoading, setLoading, isLocalLoading } = useLoadingStore();
  const { setProducts } = useProductStore();
  const { isUserEntered, setUser } = useAuthStore();
  const { setClients } = useClientStore();
  const [isCheckAuth, setIsCheckAuth] = useState(false);

  useEffect(() => {
    setLoading(true);
    validateToken().then(res => {
      if (res === 'IS_AUTH') {
        setUser(true);
      } else {
        setLoading(false);
      }
      setIsCheckAuth(true);
    })
  }, [])

  useEffect(() => {
    setLoading(true);
    if (isUserEntered) {
      Promise.all([
        ProductService.getProducts().then(products => {
          setProducts(products);
        }),
        ClientsService.getClients().then(clients => {
          setClients(clients);
        })
      ]).then(() => {
        setLoading(false);
      })
        ;
    }
  }, [isUserEntered])

  if (isLoading || !isCheckAuth) {
    return (<div className="loader">
      <MantineProvider>
        <Loader color="blue" size="xl" type="dots" />
      </MantineProvider>
    </div>)
  }

  return (
    <>
      {isLocalLoading && (<MantineProvider>
        <div className="local-loader">
          <Loader color="blue" size="xl" type="dots" />
        </div>
      </MantineProvider>)}
      <Router>
        <MantineProvider>
          <Notifications position="top-right" zIndex={1000} />
          <Routes>
            {!isUserEntered && <Route path="/" element={<Layout />}>
              <Route path={Path.AUTH} element={<Auth />} />
              <Route path="/" element={<Navigate to={'/' + Path.AUTH} />} />
              <Route path="*" element={<Navigate to={'/' + Path.AUTH} />} />
            </Route>}
            {isUserEntered &&
              <>
                <Route path="/" element={<Layout />}>
                  <Route element={<Main />}>
                    <Route path={Path.PRODUCTS} element={<ProductPage />} />
                    <Route path={Path.CLIENTS} element={<ClientPage />} />
                    <Route path={Path.PREORDERS} element={<PreOrders />} />
                    <Route path={Path.ORDERS + '/*'} element={<Orders />} />
                    <Route path="/" element={<Navigate to={'/' + Path.PRODUCTS} />} />
                    <Route path="*" element={<Navigate to={'/' + Path.PRODUCTS} />} />
                  </Route>
                </Route>
              </>
            }
          </Routes>
        </MantineProvider>
      </Router>
    </>

  )
}

export default App
