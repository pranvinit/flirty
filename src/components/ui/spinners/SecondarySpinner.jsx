import "./spinner.css";

const SecondarySpinner = ({ className = "", style = {} }) => {
  const defaultStyle = {
    ...style,
  };

  return (
    <div className={`loader-secondary ${className}`} style={defaultStyle}></div>
  );
};

export default SecondarySpinner;
