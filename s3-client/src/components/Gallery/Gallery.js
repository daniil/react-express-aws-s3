import GalleryItem from "../GalleryItem/GalleryItem";
import './Gallery.scss';

const Gallery = ({ items }) => {
  return (
    <section className="gallery">
      {
        items.length === 0 ? (
          <p className="gallery__empty">No gallery items yet. Upload your first now!</p>
        ) : (
          <>
            {items.map((item) => {
              return (
                <GalleryItem
                  key={item.id}
                  title={item.title}
                  src={item.src}
                /> 
              )  
            })}
          </>
        )
      }
    </section>
  );
};

export default Gallery;