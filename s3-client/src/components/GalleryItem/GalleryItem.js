import './GalleryItem.scss';

const GalleryItem = ({ title, src }) => {
  return (
    <article className="gallery-item">
      <img className="gallery-item__img" alt={title} src={src}/>
      <h3 className="gallery-item__title">{title}</h3>
    </article>
  );
};

export default GalleryItem;