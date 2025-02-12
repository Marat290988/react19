import { Button, TextInput, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import styles from './add-product.module.scss';
import { IconEdit, IconPhotoScan } from '@tabler/icons-react';
import { RefObject, useRef, useState } from 'react';
import { IProduct, ProductService } from '../../../api/product';
import { compressImageToBase64 } from '../../utils/compress';
import useProductStore from '../../../store/product.store';

export interface AddProductProps {
  name: string,
  image: string,
  id?: string,
  fbId?: string,
  isTouched: boolean,
}

export interface AddProductRef {
  ref?: RefObject<{
    open: (product: IProduct) => void,
    close: () => void,
  } | null>,
  onUpdate?: () => void
}

export const AddProduct: React.FC<AddProductRef> = ({ ref, onUpdate } ) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [product, setProduct] = useState<AddProductProps>({ name: '', image: '', isTouched: false });
  const { addProduct, updateProduct } = useProductStore();
  const isEdit = useRef(false);

  const pasteHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardData = event.clipboardData;
    if (clipboardData.files.length > 0) {
      const pastedFile = clipboardData.files[0];
      compressImageToBase64(pastedFile).then((base64) => {
        setProduct(prevVal => ({...prevVal, image: base64}));
      });
    } else {
      event.preventDefault();
    }
  }

  const closeModal = () => {
    isEdit.current = false;
    setProduct({ name: '', image: '', isTouched: false });
    close();
  }

  
  if (ref) {
    ref.current = {
      open: (product: IProduct) => {
        isEdit.current = true;
        setProduct({name: product.name, image: product.image ? product.image : '', id: product.id, fbId: product.fbId ,isTouched: true});
        open();
      },
      close: () => {
        closeModal();
      }
    }
  }

  const saveProduct = () => {
    const id = crypto.randomUUID();
    ProductService.saveProduct(product, id).then(response => {
      if (response) {
        addProduct({...product, fbId: response[0].key as string, id: id});
        onUpdate && onUpdate();
        closeModal();
      }
    });
  }

  const updateProductHandler = () => {
    const updateProductItem = {name: product.name, image: product.image, id: product.id, fbId: product.fbId as string} as IProduct;
    ProductService.updateProduct(updateProductItem).then(response => {
      if (response) {
        updateProduct(updateProductItem);
        onUpdate && onUpdate();
        closeModal();
      }
    })
  }

  return (
    <div className={styles['add-product']}>
      <Modal
        title="Add / Edit Product"
        opened={opened}
        onClose={closeModal}
        centered
      >
        <div className={styles['add-product__body']}>
          <TextInput 
            value={product.name}
            label="Product name" 
            placeholder="Product name" 
            leftSection={<IconEdit size={16} />}
            onInput={(e) => setProduct(prevVal => ({...prevVal, name: (e.target as any).value}))} 
            onBlur={() => setProduct(prevVal => ({...prevVal, isTouched: true}))}
            error={product.isTouched && product.name === ''}
          />
          <TextInput 
            label="Paste the copied image" 
            placeholder="Image" 
            leftSection={<IconPhotoScan size={16} />}
            onPaste={pasteHandler} 
          />
          {product.image !== '' &&
            <div className={styles['add-product__body-image']}>
              <img src={product.image} />
            </div>
          }
          <div className={styles['add-product__body-buttons']}>
            <Button 
              disabled={product.name === ''}
              onClick={() => isEdit.current ? updateProductHandler() : saveProduct()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <Button variant="filled" onClick={open}>Add Product</Button>
    </div>
  )
}