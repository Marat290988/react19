import React, { useEffect, useRef, useState } from 'react';
import styles from './product-page.module.scss';
import { AddProduct } from '../../shared/components/add-product/add-product';
import { IProduct, ProductService } from '../../api/product';
import useProductStore from '../../store/product.store';
import { CustomGrid, IGrid } from '../../shared/components/custom-grid/custom-grid';
import { Loader, Pagination } from '@mantine/core';
import { useLoadingStore } from '../../store/loading.store';

const qtyElementOnPage = 10;

const ProductPage: React.FC = () => {

  const { products: storageProducts, removeProduct, updateProduct } = useProductStore();
  const { isLoading } = useLoadingStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pageData, setPageData] = useState({
    currentPage: 1,
    totalPage: 0,
  });

  const getProductData = (page: number) => {
    const totalElementInPrev = (page - 1) * qtyElementOnPage;
    const leftPart = useProductStore.getState().products.slice(totalElementInPrev, useProductStore.getState().products.length);
    const nextPart = useProductStore.getState().products
      .slice(
        totalElementInPrev,
        leftPart.length >= qtyElementOnPage ? totalElementInPrev + qtyElementOnPage : useProductStore.getState().products.length
      );
    ProductService.getProductWithImage(nextPart).then(productsWithImage => {
      productsWithImage.forEach(p => { 
        updateProduct(p);
        const findIndex = nextPart.findIndex(p2 => p2.id === p.id);
        nextPart[findIndex].image = p.image;
      });
      setProducts(nextPart);
    });
  }

  useEffect(() => {
    getProductData(pageData.currentPage);
  }, [pageData.currentPage]);

  useEffect(() => {
    setPageData(state => ({...state, totalPage: Math.ceil(storageProducts.length / qtyElementOnPage)}));
  }, [storageProducts]);

  const deleteProductHandler = (product: IProduct): Promise<any> => {
    return ProductService.removeProduct(product).then(res => {
      if (res === 'OK') {
        removeProduct(product);
        getProductData(pageData.currentPage);
      }
    })
  }

  const productModal = useRef<{
    open: (product: IProduct) => void,
    close: () => void,
  } | null>(null);

  const grid: IGrid = {
    headersName: ['', 'Name', 'Edit'],
    gridSize: '50px 60px minmax(200px, auto) 200px',
    data: products,
    columns: [
      { name: 'image', isImage: true, styles: { textAlign: 'center' } },
      { name: 'name' },
      {
        name: 'Edit',
        isAction: true,
        styles: { justifyContent: 'center' },
        buttons: [
          {
            buttonTitle: 'Edit',
            action: productModal.current ? productModal.current.open : null,
            typeAction: 'item',
          },
          {
            buttonTitle: 'Delete',
            action: deleteProductHandler,
            typeAction: 'item',
            buttonColor: 'red',
            isSure: true,
          },
        ]
      },
    ]
  }

  if (isLoading) {
    return (
      <div className={styles['loader']}>
        <Loader color="blue" size="xl" type="dots" />
      </div>
    )
  }

  const onPageChange = (page: number) => {
    setPageData(state => ({...state, currentPage: page}));
  }

  const onUpdate = () => {
    getProductData(pageData.currentPage);
  }

  return (
    <div className={styles['product-page']}>
      <h2>Add / Edit Products Page</h2>
      <AddProduct ref={productModal} onUpdate={onUpdate} />
      <CustomGrid gridValue={grid} currentPage={pageData.currentPage - 1}  />
      {pageData.totalPage > 0 && <Pagination total={pageData.totalPage} onChange={onPageChange} />}
    </div>
  );
};

export default ProductPage;
