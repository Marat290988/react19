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

function App() {

  const { validateToken } = useAuthStore();
  const { isLoading, setLoading } = useLoadingStore();
  const { setProducts } = useProductStore();
  const { isUserEntered, setUser } = useAuthStore();
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
      ProductService.getProducts().then(products => {
        setLoading(false);
        setProducts(products);
      });
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
    <Router>
      <MantineProvider>
        <Routes>
          {!isUserEntered && <Route path="/" element={<Layout />}>
            <Route path="auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/auth" />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Route>}
          {isUserEntered &&
            <>
              <Route path="/" element={<Layout />}>
                <Route element={<Main />}>
                  <Route path="products" element={<ProductPage />} />
                  <Route path="/" element={<Navigate to="/products" />} />
                  <Route path="*" element={<Navigate to="/products" />} />
                </Route>
              </Route>
            </>
          }
        </Routes>
      </MantineProvider>
    </Router>
  )
}

export default App
