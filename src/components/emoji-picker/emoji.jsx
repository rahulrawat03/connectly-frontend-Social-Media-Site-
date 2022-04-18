import "./emoji.css";

function Emoji({ emoji, onClick }) {
  return (
    <div className="emoji" onClick={() => onClick(emoji)}>
      {emoji}
    </div>
  );
}

export default Emoji;
