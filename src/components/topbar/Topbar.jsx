import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Modal from "./modal";
import userContext from "../../context/userContext";
import {
  resetNotifications,
  getUnseenConversationsCount,
} from "../../services/http";
import { logout } from "../../services/localStorage";

export default function Topbar({ query, setQuery, feed, setFeed }) {
  const { user } = useContext(userContext);
  const [currentQuery, setCurrentQuery] = useState(query);
  const [activeIcon, setActiveIcon] = useState("");
  const [newNotifications, setNewNotifications] = useState(false);
  const [unseenConv, setUnseenConv] = useState(false);

  useEffect(() => {
    setNewNotifications(user.newNotifications);
    const fetchUnseenConv = async () => {
      const unseen = await getUnseenConversationsCount(user._id);
      setUnseenConv(unseen);
    };

    fetchUnseenConv();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(currentQuery);
  };

  const handleIconClick = (icon) => {
    if (activeIcon === icon) setActiveIcon("");
    else setActiveIcon(icon);

    if (icon === "chats") {
      if (activeIcon !== "chats" && feed !== "chats") setFeed("chats");
      else if (activeIcon === "chats" && feed === "chats") setFeed("news");
    }
  };

  const handleNotificationsStatus = async () => {
    await resetNotifications(user._id);
    setNewNotifications(false);
  };

  const getClass = (icon) => icon === activeIcon && "topbar__icon--active";

  return (
    <div className="topbarContainer">
      <Link to="/" style={{ textDecoration: "none" }} className="topbarLeft">
        <img src="/images/logo.svg" alt="app log" className="icon" />
        <div className="logo">Connectly</div>
      </Link>
      <div className="topbarCenter">
        <form className="searchbar" onSubmit={handleSearch}>
          <Search className="searchIcon" />
          <input
            placeholder="Search"
            className="searchInput"
            value={currentQuery}
            onChange={({ currentTarget }) =>
              setCurrentQuery(currentTarget.value)
            }
          />
        </form>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div
            className={`topbarIconItem ${getClass("friends")}`}
            onClick={() => handleIconClick("friends")}
          >
            <Person className="topbarIcon" />
          </div>
          <div
            className={`topbarIconItem ${getClass("chats")}`}
            onClick={() => handleIconClick("chats")}
          >
            <Chat className="topbarIcon" />
            {unseenConv && <span className="topbarIconBadge"></span>}
          </div>
          <div
            className={`topbarIconItem ${getClass("notifications")}`}
            onClick={async () => {
              handleIconClick("notifications");
              await handleNotificationsStatus();
            }}
          >
            <Notifications className="topbarIcon" />
            {newNotifications && <span className="topbarIconBadge"></span>}
          </div>
          {activeIcon === "friends" && <Modal items={user.friends} />}
          {activeIcon === "notifications" && (
            <Modal items={user.notifications} isNotification />
          )}
        </div>
      </div>
      <Link to={`/profile/${user._id}`}>
        <img
          src={user.profilePicture || "/images/profile.svg"}
          alt="user profile"
          className="topbarImg"
        />
      </Link>
      <button
        className="btn__logout"
        onClick={() => {
          logout();
          window.location = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}
