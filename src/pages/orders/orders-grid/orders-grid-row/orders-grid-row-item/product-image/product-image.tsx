import { IconPhotoScan } from "@tabler/icons-react"
import useProductStore from "../../../../../../store/product.store";
import { useEffect, useState } from "react";
import { ProductService } from "../../../../../../api/product";

export const ProductImage: React.FC<{productId: string}> = ({ productId }) => {

  const { products: storageProducts, updateProduct } = useProductStore();
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (productId === '' || !!productId === false) {
      setImageSrc('');
      return;
    };
    const findIndex = storageProducts.findIndex(p => p.id === productId);
    if (findIndex !== -1) {
      const findImageSrc = storageProducts[findIndex].image;
      if (findImageSrc !=='' && !!findImageSrc === true) {
        setImageSrc(findImageSrc);
      } else {
        ProductService.getProductImage(productId).then(image => {
          const findIndex = storageProducts.findIndex(p => p.id === productId);
          if (findIndex !== -1) {
            storageProducts[findIndex].image = image?.image;
            updateProduct(storageProducts[findIndex]);
            setImageSrc(image!.image);
          };
        });
      }
    }
  }, [productId])

  return (
    <div
      style={{
        marginRight: '0.5rem',
        width: '26px',
        height: '26px',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {(imageSrc === '' || !!imageSrc === false) && <IconPhotoScan size={40} />}
      {(imageSrc !== '' && !!imageSrc !== false) && <img 
          src={imageSrc} 
          alt="image" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />}
    </div>
  )
}