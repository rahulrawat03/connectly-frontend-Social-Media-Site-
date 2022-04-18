import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import userContext from "../../context/userContext";
import { getTimelinePosts, getPersonalPosts } from "../../services/http";

export default function News({ userId }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(userContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = userId
        ? await getPersonalPosts(userId)
        : await getTimelinePosts(user._id);
      setPosts(
        posts.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [userId, user]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!userId || userId === user._id) && (
          <Share posts={posts} setPosts={setPosts} />
        )}
        {posts.map((p, index) => (
          <Post key={index} post={p} />
        ))}
      </div>
    </div>
  );
}
