import "./closeFriend.css";
import { Link } from "react-router-dom";

export default function CloseFriend({ user, real }) {
  return (
    <Link
      to={real ? `/profile/${user._id}` : ""}
      target={real && "_blank"}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <li className="sidebarFriend">
        <div className="friendImgContainer">
          <img
            className="sidebarFriendImg"
            src={
              real
                ? user.profilePicture || "/images/profile.svg"
                : "/images/users.png"
            }
            alt=""
            style={
              real
                ? {}
                : {
                    top: user.top,
                    left: user.left,
                    transform: user.transform,
                  }
            }
          />
        </div>
        <span className="sidebarFriendName">{user.username}</span>
      </li>
    </Link>
  );
}
