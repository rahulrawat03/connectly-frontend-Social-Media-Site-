import "./loader.css";

function Loader({ style }) {
  return (
    <div className="loader__wrapper" style={style}>
      <img src="/images/logo.svg" alt="" className="loader" />
    </div>
  );
}

export default Loader;
