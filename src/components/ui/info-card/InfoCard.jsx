import "./info-card.css";

const InfoCard = ({ items = [] }) => {
  return (
    <div className="info-card">
      {items.map((item, index) => (
        <div key={index} className="g-fg">
          <strong className="g-fg">{item.label}</strong>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoCard;
