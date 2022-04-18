import Emoji from "./emoji";
import emojis from "./emojis.json";
import "./picker.css";

function Picker({ className, onClick }) {
  return (
    <section className={`picker ${className}`}>
      {emojis.map((emoji, index) => (
        <Emoji key={index} emoji={emoji} onClick={onClick} />
      ))}
    </section>
  );
}

export default Picker;
