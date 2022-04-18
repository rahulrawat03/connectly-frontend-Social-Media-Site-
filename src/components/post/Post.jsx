import "./post.css";
import { MoreVert, Send } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { getUser, likePost, commentOnPost } from "../../services/http";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import userContext from "../../context/userContext";

export default function Post({ post }) {
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(userContext);
  const [comments, setComments] = useState([]);
  const [commentsExpanded, expandComments] = useState(false);
  const [currentComment, setCurrentComment] = useState("");

  useEffect(() => {
    if (post.likes) setLike(post.likes.length);
    if (post.comments) setComments(post.comments);
  }, [post]);

  useEffect(() => {
    setIsLiked(post.likes?.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(post.userId);
      setUser(user);
    };

    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    await likePost(post._id, currentUser._id);

    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleCommentChange = ({ currentTarget: target }) => {
    setCurrentComment(target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (currentComment === "") return;
    await commentOnPost(
      post._id,
      currentUser._id,
      currentUser.username,
      currentComment
    );

    const newComment = {
      username: currentUser.username,
      desc: currentComment,
    };

    setComments([...comments, newComment]);
    setCurrentComment("");
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture || "/images/profile.svg"}
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && <img className="postImg" src={post.img} alt="" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src="/images/like.svg"
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => expandComments(!commentsExpanded)}
            >
              {post.comments ? post.comments.length : 0} comments
            </span>
          </div>
        </div>
        {commentsExpanded && (
          <div className="comment__section">
            {comments?.map((comment, index) => (
              <div className="comment" key={index}>
                <div className="comment--name">{comment.username}</div>
                <div className="comment--text">{comment.desc}</div>
              </div>
            ))}
            <form onSubmit={handleCommentSubmit} className="current-comment">
              <textarea
                type="text"
                className="current-comment--text"
                autoFocus
                placeholder="Comment here..."
                value={currentComment}
                onChange={handleCommentChange}
              ></textarea>
              <button type="submit" className="comment--submit">
                <Send />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
