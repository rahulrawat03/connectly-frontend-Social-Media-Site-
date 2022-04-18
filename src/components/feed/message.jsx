import "./feed.css";
import { useEffect, useRef } from "react";

export default function Message({ text, own }) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={`message-wrapper ${own && "message--own"}`} ref={scrollRef}>
      <div className="message">{text}</div>
    </div>
  );
}
