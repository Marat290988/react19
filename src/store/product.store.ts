import { create } from 'zustand';
import { IProduct } from '../api/product';

interface ProductStore {
  products: IProduct[],
  setProducts: (products: IProduct[]) => void,
  addProduct: (product: IProduct) => void,
  removeProduct: (product: IProduct) => void,
  updateProduct: (product: IProduct) => void,  
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products: IProduct[]) => set({ products }),
  addProduct: (product: IProduct) => set(state => ({ products: [...state.products, product] })),
  removeProduct: (product: IProduct) => set(state => ({ products: state.products.filter(p => p.id !== product.id) })),
  updateProduct: (product: IProduct) => set(state => {
    return { products: state.products.map(p => p.id === product.id ? product : p) }
  }),
}));

export default useProductStore;