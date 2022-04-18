import "./topbar.css";
import { useEffect, useState } from "react";
import { getUser } from "../../services/http";

function Notification({ notification }) {
  return <div className="notification">{notification}</div>;
}

function Friend({ friendId }) {
  const [friend, setFriend] = useState({});
  useEffect(() => {
    const fetchFriend = async () => {
      const user = await getUser(friendId);
      setFriend(user);
    };

    fetchFriend();
  }, [friendId]);

  return (
    <div className="notification">
      <div className="topbar__friend">
        <img
          src={friend.profilePicture || "/images/profile.svg"}
          alt=""
          className="friend__img"
        />
        <h3 className="friend__name">{friend.username}</h3>
      </div>
    </div>
  );
}

function Empty({ field }) {
  return (
    <div className="empty-item">
      No {field}
      <img src="/images/notFound.svg" alt="" className="empty-item__icon" />
    </div>
  );
}

export default function Modal({ items, isNotification }) {
  return (
    <div className="topbar__modal">
      {isNotification &&
        (items.length === 0 ? (
          <Empty field="notifications" />
        ) : (
          items.map((item, index) => (
            <Notification key={index} notification={item} />
          ))
        ))}
      {!isNotification &&
        (items.length === 0 ? (
          <Empty field="friends" />
        ) : (
          items.map((item, index) => <Friend key={index} friendId={item} />)
        ))}
    </div>
  );
}
