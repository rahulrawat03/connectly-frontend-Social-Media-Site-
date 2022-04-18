import "./share.css";
import { PermMedia, Room, EmojiEmotions, Cancel } from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { createPost } from "../../services/http";
import userContext from "../../context/userContext";
import Picker from "../emoji-picker/picker";
import Sentiment from "sentiment";

export default function Share({ posts, setPosts }) {
  const { user } = useContext(userContext);
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [emojiOpened, openEmoji] = useState(false);
  const sentiment = new Sentiment();
  const [modalOpened, openModal] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const sentimentScore = sentiment.analyze(desc.current.value);

    if (sentimentScore.comparative < 0) {
      desc.current.value = "";
      openModal(true);
      return;
    }

    const data = new FormData();
    data.append("userId", user._id);
    data.append("desc", desc.current.value);

    if (file) {
      data.append("file", file);
    }

    const newPost = await createPost(data);
    setPosts([newPost, ...posts]);
    setFile(null);
    desc.current.value = "";
  };

  const handleEmojiClick = (emoji) => {
    desc.current.value = `${desc.current.value}${emoji}`;
  };

  return (
    <div className="share">
      {modalOpened && (
        <section className="error-modal">
          <div className="error__text">
            <p>Your post can hurt someone's sentiments</p>
            <button className="error__close" onClick={() => openModal(false)}>
              close
            </button>
          </div>
        </section>
      )}
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={user.profilePicture || "/images/profile.svg"}
            alt=""
          />
          <input
            placeholder={"Share your feelings " + user.username}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form
          className="shareBottom"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div
              className={`shareOption ${emojiOpened && "emoji-picker--active"}`}
              onClick={() => openEmoji(!emojiOpened)}
            >
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
            {emojiOpened && (
              <Picker className="emoji-picker" onClick={handleEmojiClick} />
            )}
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
