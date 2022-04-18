import "./feed.css";
import { Link } from "react-router-dom";
import { MoreVert, Add } from "@material-ui/icons";

function VideoPost({ videoUrl, username, userImg, desc }) {
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to="">
              <img className="postProfileImg" src={userImg} alt="" />
            </Link>
            <span className="postUsername">{username}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <div className="postText">{desc}</div>
          <video
            src={videoUrl}
            autoPlay
            controls
            loop
            className="postVideo"
          ></video>
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src="/images/like.svg" alt="" />
            <span className="postLikeCounter">2 people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">1 comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Videos() {
  return (
    <section className="feed">
      <div className="feedWrapper">
        <VideoPost
          videoUrl="/videos/cute.mp4"
          username="Rahul"
          userImg="/images/profile.svg"
          desc="❤️❤️❤️"
        />
        <VideoPost
          videoUrl="/videos/lotus.mp4"
          username="Connectly"
          userImg="/images/logo.svg"
          desc="Beautiful lotus"
        />
        <VideoPost
          videoUrl="/videos/car.mp4"
          username="Connectly"
          userImg="/images/logo.svg"
          desc="Kind of holiday we all want"
        />
      </div>
      <div className="addVideo">
        <label htmlFor="videoPost">
          <Add className="addVideo__icon" />
        </label>
        <input type="file" accept=".mp4,.3gp" id="videoPost" />
      </div>
    </section>
  );
}

export default Videos;
