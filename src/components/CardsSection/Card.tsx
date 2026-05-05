interface CardProps {
  sectionId: string;
  imageUrl: string;
  title: string;
  altText: string;
  location: string;
  onButtonClick?: (sectionId: string) => void;
  activeSectionId?: string;
}

export const Card = (props: CardProps) => {
  const { imageUrl, altText, title, location, sectionId, onButtonClick, activeSectionId = "" } = props;

  return (
    <div className="card text-white ev-card-item">
      <img src={imageUrl} className={`ev-card-image ${location === "/animales" && sectionId !== activeSectionId ? "ev-picture-card-b-n-w" : ""}`} alt={altText} />
      <div className="card-img-overlay d-flex align-items-end p-0">
        <div className="w-100 bg-dark d-flex flex-column align-items-center pb-1">
          <h2 className="card-title w-100 text-center bg-dark py-0 m-0">
            {title}
          </h2>
          {location === "/animales" && (
            <button className={`btn ${sectionId !== activeSectionId ? "btn-secondary" : "btn-warning"} w-50`} onClick={() => onButtonClick!(sectionId)}>Info</button>
          )}
        </div>
      </div>
    </div>
  );
};
