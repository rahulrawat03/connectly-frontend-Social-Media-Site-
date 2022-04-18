import "./feed.css";
import { useContext, useEffect, useState } from "react";
import { Send } from "@material-ui/icons";
import Message from "./message";
import userContext from "../../context/userContext";
import { getMessages, postMessage, getConvDetails } from "../../services/http";
import {
  sendMessage,
  listenMessage,
  offMessageListener,
  sendBadge,
} from "../../services/socket";

export default function Messenger({ currentConv }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState({});
  const { user } = useContext(userContext);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(currentConv);
      const friend = await getConvDetails(user._id, currentConv);

      setFriend(friend || {});
      setMessages(messages || []);
    };

    setMessages([]);
    setFriend({});
    fetchMessages();
  }, [currentConv, user]);

  useEffect(() => {
    const handler = (payload) => {
      if (payload.senderId !== friend._id) return;
      setMessages([...messages, payload]);
    };

    listenMessage(handler);
    return () => offMessageListener(handler);
  }, [messages, friend]);

  const handleSend = async () => {
    const message = await postMessage(user._id, currentConv, currentMessage);
    setMessages([...messages, message]);
    sendMessage(user._id, friend._id, currentMessage);
    sendBadge(friend._id, currentConv);
    setCurrentMessage("");
  };

  return (
    <section className="feed">
      <div className="feedWrapper messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {currentConv &&
              messages?.map((message, index) => (
                <Message
                  key={index}
                  text={message.text}
                  own={user._id === message.senderId}
                />
              ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentConv ? (
              <div className="chatBoxMain">
                <textarea
                  className="chatMessageInput"
                  placeholder="Type your message..."
                  onChange={({ currentTarget }) =>
                    setCurrentMessage(currentTarget.value)
                  }
                  value={currentMessage}
                ></textarea>
                <Send className="chatSubmitButton" onClick={handleSend} />
              </div>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
                <hr className="conv__rule" />
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
