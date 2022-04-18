import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Event,
  LocalOffer,
  LibraryBooks,
} from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { getUser } from "../../services/http";
import userContext from "../../context/userContext";
import "./sidebar.css";

export default function Sidebar({ feed, setFeed }) {
  const [friends, setFriends] = useState([]);
  const { user } = useContext(userContext);

  useEffect(() => {
    const fetchFriends = async () => {
      const friends = [];

      for (let friendId of user.friends) {
        const friend = await getUser(friendId);
        friends.push(friend);
      }

      setFriends(friends || []);
    };

    fetchFriends();
  }, [user]);

  const getClassName = (item) => feed === item && "sidebarListItem--active";

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li
            className={`sidebarListItem ${getClassName("news")}`}
            onClick={() => setFeed("news")}
          >
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">News Feed</span>
          </li>
          <li
            className={`sidebarListItem ${getClassName("chats")}`}
            onClick={() => setFeed("chats")}
          >
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li
            className={`sidebarListItem ${getClassName("videos")}`}
            onClick={() => setFeed("videos")}
          >
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li
            className={`sidebarListItem ${getClassName("events")}`}
            onClick={() => setFeed("events")}
          >
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li
            className={`sidebarListItem ${getClassName("products")}`}
            onClick={() => setFeed("products")}
          >
            <LocalOffer className="sidebarIcon" />
            <span className="sidebarListItemText">Products</span>
          </li>
          <li
            className={`sidebarListItem ${getClassName("books")}`}
            onClick={() => setFeed("books")}
          >
            <LibraryBooks className="sidebarIcon" />
            <span className="sidebarListItemText">Books</span>
          </li>
        </ul>
        <hr className="sidebarHr" />
        <div className="userFriends">
          <h3>Friends</h3>
          <ul className="sidebarFriendList">
            {friends.map((u) => (
              <CloseFriend key={u._id} user={u} real />
            ))}
          </ul>
        </div>
        <hr className="sidebarHr" />
        <div className="relatedPeople">
          <h3>People you may know</h3>
          <ul className="sidebarFriendList">
            {Users.map((u) => (
              <CloseFriend key={u.id} user={u} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
