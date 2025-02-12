import { equalTo, get, orderByChild, push, query, ref, remove, update, } from "firebase/database";
import { dataBase } from "./firebaseConfig";

export interface IProductBase {
  id: string,
  name: string,
  image?: string,
}

export interface IProduct extends IProductBase {
  fbId: string,
}

const path = 'products';
const dataRef = ref(dataBase, path);
const dataImageRef = ref(dataBase, `productImage`);

export const ProductService = {
  saveProduct: (product: { name: string, image: string}, id: string) => {
    const productFirebase: IProductBase = {
      id: id,
      name: product.name,
    };
    return Promise.all([push(dataRef, productFirebase), push(dataImageRef, {image: product.image, id: productFirebase.id})]);
  },
  getProducts: async (): Promise<any> => {
    try {
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        const fireBaseData: { [key: string]: IProduct } = snapshot.val();
        const data: IProduct[] = [];
        for (const key in fireBaseData) {
          const product: IProduct = fireBaseData[key];
          product.fbId = key;
          data.push(product);
        }
        return data;
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  getProductImage: async (id: string): Promise<null | {id: string, image: string}> => {
    try {
      const q = query(dataImageRef, orderByChild('id'), equalTo(id));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const results: any[] = [];
        snapshot.forEach((childSnapshot) => {
          results.push({ id: childSnapshot.key, ...childSnapshot.val() }); // Сохраняем данные вместе с ключом
        });
        return results.length > 0 ? results[0] : null; // Возвращаем список объектов
      } else {
        console.log("Объект не найден");
        return null;
      }
    } catch (error) {
      console.error("Ошибка при получении объекта:", error);
      throw error;
    }
  },
  updateProduct: async (product: IProduct) => {
    try {
      const objectProductRef = ref(dataBase, `${path}/${product.fbId}`);
      const productUpdateItem = {
        name: product.name,
        id: product.id,
      };
      await update(objectProductRef, productUpdateItem);
      const q = query(dataImageRef, orderByChild('id'), equalTo(product.id));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        let key: string | undefined = undefined;
        snapshot.forEach((childSnapshot) => {
          key = childSnapshot.key;
        });
        if (key) {
          await update(ref(dataBase, `productImage/${key}`), {image: product.image});
        }
      }
      return product;
    } catch (error) {
      console.error('Ошибка при обновлении объекта:', error);
      throw error;
    }
  },
  removeProduct: async (product: IProduct): Promise<'OK'> => {
    try {
      const objectProductRef = ref(dataBase, `${path}/${product.fbId}`);
      await remove(objectProductRef);
      const q = query(dataImageRef, orderByChild('id'), equalTo(product.id));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        let key: string | undefined = undefined;
        snapshot.forEach((childSnapshot) => {
          key = childSnapshot.key;
        });
        if (key) {
          await remove(ref(dataBase, `productImage/${key}`));
        }
      }
      return 'OK';
    } catch (error) {
      console.error('Ошибка при удалении объекта:', error);
      throw error;
    }
  },
  getProductWithImage: async (products: IProduct[]): Promise<IProduct[]> => {
    if (products.filter(p => !p.image).length === 0) {
      return [];
    }
    await Promise.all(products.filter(p => !p.image).map((product: IProduct) => ProductService.getProductImage(product.id))).then(images => {
      images.forEach(image => {
        if (image) {
          const pr = products.find(p => p.id === image.id);
          if (pr) {
            pr.image = image.image;
          }
        }
      })
    });
    return products;
  }
}