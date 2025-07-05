import "./spinner.css";

const PrimarySpinner = ({ className = "", style = {} }) => {
  const defaultStyle = {
    ...style,
  };

  return (
    <div className={`loader-primary ${className}`} style={defaultStyle}></div>
  );
};

export default PrimarySpinner;
