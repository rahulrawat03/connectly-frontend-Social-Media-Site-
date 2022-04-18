import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import News from "../../components/feed/news";
import { PersonAdd, Group, ArrowForward, ArrowBack } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUser,
  changeProfile,
  changeCover,
  changeDescription,
  sendRequest,
  acceptRequest,
} from "../../services/http";
import userContext from "../../context/userContext";

export default function Profile({ feed, setFeed: setCurrentFeed }) {
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileChange, setProfileChange] = useState(false);
  const [coverChange, setCoverChange] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [desc, setDesc] = useState("");
  const { user: currentUser, setUser: setCurrentUser } =
    useContext(userContext);

  const [isFriend, makeFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestReceived, setRequestReceived] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(userId);
      setUser(user);
    };

    fetchUser();
    makeFriend(currentUser.friends?.includes(userId));
    setRequestSent(currentUser.requestsSent?.includes(userId));
    setRequestReceived(currentUser.requestsReceived?.includes(userId));
  }, [userId, currentUser]);

  useEffect(() => {
    setProfileImg(user.profilePicture || "/images/profile.svg");
    setCoverImg(user.coverPicture || "/images/profile.svg");
    setDesc(user.desc || "");
  }, [user]);

  const setFeed = (feed) => {
    setCurrentFeed(feed);
    navigate("/");
  };

  const handleProfileChange = async ({ currentTarget }) => {
    const img = currentTarget.files[0];

    const profileUrl = URL.createObjectURL(img);
    setProfileImg(profileUrl);
    await changeProfile(img, userId);
  };

  const handleCoverChange = async ({ currentTarget }) => {
    const img = currentTarget.files[0];

    const coverUrl = URL.createObjectURL(img);
    setCoverImg(coverUrl);
    await changeCover(img, userId);
  };

  const handleDescSave = async () => {
    await changeDescription(desc, userId);
  };

  const sendFriendRequest = async () => {
    const user = await sendRequest(currentUser._id, userId);
    if (requestSent) setRequestSent(false);
    else setRequestSent(true);

    setCurrentUser(user);
  };

  const acceptFriendRequest = async () => {
    const user = await acceptRequest(currentUser._id, userId);
    setRequestReceived(false);
    makeFriend(true);
    setCurrentUser(user);
  };

  const isAnonymous = () => !(isFriend || requestReceived || requestSent);
  const ownProfile = userId === currentUser._id;

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar feed={feed} setFeed={setFeed} />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={coverImg}
                alt=""
                onMouseOver={() => setCoverChange(true)}
                onMouseOut={() => setCoverChange(false)}
              />
              <img
                className="profileUserImg"
                src={profileImg}
                alt=""
                onMouseOver={() => setProfileChange(true)}
                onMouseOut={() => setProfileChange(false)}
              />
              {ownProfile && profileChange && (
                <label
                  htmlFor="profileUserImg"
                  className="userImgChange"
                  onMouseOver={() => setProfileChange(true)}
                  onMouseOut={() => setProfileChange(false)}
                >
                  Change
                  <input
                    type="file"
                    id="profileUserImg"
                    style={{ display: "none" }}
                    accept=".png,.jpeg,.jpg"
                    onChange={handleProfileChange}
                  />
                </label>
              )}
              {ownProfile && coverChange && (
                <label
                  htmlFor="profileCoverImg"
                  className="coverImgChange"
                  onMouseOver={() => setCoverChange(true)}
                  onMouseOut={() => setCoverChange(false)}
                >
                  Change
                  <input
                    type="file"
                    id="profileCoverImg"
                    style={{ display: "none" }}
                    accept=".png,.jpeg,.jpg"
                    onChange={handleCoverChange}
                  />
                </label>
              )}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <div className="profileDescGroup">
                {ownProfile ? (
                  <input
                    type="text"
                    className="profileInfoDesc"
                    value={desc}
                    onChange={({ currentTarget }) =>
                      setDesc(currentTarget.value)
                    }
                  />
                ) : (
                  <div className="profileInfoDesc">{desc || "..."}</div>
                )}
                {ownProfile && (
                  <button className="profileInfoSave" onClick={handleDescSave}>
                    save
                  </button>
                )}
              </div>
              {!ownProfile && isAnonymous() && (
                <PersonAdd
                  className="btn__request btn__request--send"
                  onClick={sendFriendRequest}
                />
              )}
              {!ownProfile && isFriend && (
                <Group className="btn__request btn__request--friend" />
              )}
              {!ownProfile && requestReceived && (
                <ArrowBack
                  className="btn__request btn__request--received"
                  onClick={acceptFriendRequest}
                />
              )}
              {!ownProfile && requestSent && (
                <ArrowForward
                  className="btn__request btn__request--sent"
                  onClick={sendFriendRequest}
                />
              )}
            </div>
          </div>
          <div className="profileRightBottom">
            <News userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
}
