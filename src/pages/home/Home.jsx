import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import News from "../../components/feed/news";
import Videos from "../../components/feed/videos";
import Events from "../../components/feed/events";
import Products from "../../components/feed/products";
import Search from "../../components/feed/search";
import Messenger from "../../components/feed/messenger";
import Conversation from "../../components/rightbar/conversation";
import Rightbar from "../../components/rightbar/Rightbar";
import { useState } from "react";
import "./home.css";

export default function Home({ feed, setFeed }) {
  const [query, setQuery] = useState("");
  const [currentConv, setCurrentConv] = useState("");

  const setCurrentFeed = (feed) => {
    setQuery("");
    setFeed(feed);
  };

  const setCurrentQuery = (query) => {
    if (query) setFeed("search");
    else setFeed("news");

    setQuery(query);
  };

  return (
    <>
      <Topbar
        query={query}
        setQuery={setCurrentQuery}
        feed={feed}
        setFeed={setCurrentFeed}
      />
      <div className="homeContainer">
        <Sidebar feed={feed} setFeed={setCurrentFeed} />
        {feed === "news" && <News />}
        {feed === "videos" && <Videos />}
        {feed === "events" && <Events />}
        {feed === "products" && (
          <Products isBook={false} setFeed={setCurrentFeed} />
        )}
        {feed === "books" && (
          <Products isBook={true} setFeed={setCurrentFeed} />
        )}
        {query && <Search query={query} />}
        {feed === "chats" && <Messenger currentConv={currentConv} />}
        {feed !== "chats" && <Rightbar />}
        {feed === "chats" && (
          <Conversation
            currentConv={currentConv}
            setCurrentConv={setCurrentConv}
          />
        )}
      </div>
    </>
  );
}
