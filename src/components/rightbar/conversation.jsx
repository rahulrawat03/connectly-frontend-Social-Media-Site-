import "./Rightbar";
import { getUserConversations, getConvDetails } from "../../services/http";
import { useContext, useEffect, useState } from "react";
import userContext from "../../context/userContext";
import { markSeenConversation } from "../../services/http";
import { listenBadge, offBadgeListener } from "../../services/socket";

function SingleConversation({
  userId,
  convId,
  onConvChange,
  className,
  unseen,
}) {
  const [friend, setFriend] = useState({});
  const [seen, setSeen] = useState(!unseen);

  useEffect(() => {
    const handler = (payload) => {
      if (payload === convId) setSeen(false);
    };

    listenBadge(handler);
    return () => offBadgeListener(handler);
  }, [convId]);

  useEffect(() => {
    const fetchDetails = async () => {
      const friend = await getConvDetails(userId, convId);
      setFriend(friend);
    };

    fetchDetails();
  }, [userId, convId]);

  const markSeen = async () => {
    await markSeenConversation(userId, convId);
    setSeen(true);
  };

  return (
    <div
      className={`conversation ${className}`}
      onClick={async () => {
        onConvChange(convId);
        await markSeen();
      }}
    >
      <img
        src={friend.profilePicture || "/images/profile.svg"}
        alt=""
        className="conv__friend"
      />
      <h3 className="conv__name">{friend.username}</h3>
      {!seen && <span className="conv__badge"></span>}
    </div>
  );
}

export default function Conversation({ currentConv, setCurrentConv }) {
  const { user } = useContext(userContext);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConv = async () => {
      const conv = await getUserConversations(user._id);
      setConversations(conv);
    };

    fetchConv();
  }, [user]);

  const getClass = (convId) => currentConv === convId && "conversation--active";

  return (
    <section className="rightbar">
      <input
        type="text"
        className="search-conversation"
        placeholder="Search Conversation..."
      />
      <div className="conversations">
        {conversations.map((c) => (
          <SingleConversation
            key={c._id}
            userId={user._id}
            convId={c._id}
            className={getClass(c._id)}
            onConvChange={setCurrentConv}
            unseen={c.notSeen}
          />
        ))}
      </div>
    </section>
  );
}
