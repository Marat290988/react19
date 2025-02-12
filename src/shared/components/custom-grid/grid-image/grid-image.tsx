import { IconPhotoScan } from "@tabler/icons-react"

export const GridImage: React.FC<{ image?: string }> = ({ image }) => {

  return (
    <>
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {image && <img 
          src={image} 
          alt="image" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />}
        {!image && <IconPhotoScan size={40} />}
      </div>
    </>
  )
}