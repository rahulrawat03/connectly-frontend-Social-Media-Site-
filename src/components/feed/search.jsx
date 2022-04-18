import "./feed.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductPost } from "./products";
import { EventPost } from "./events";
import {
  searchPeople,
  searchEvents,
  searchProducts,
  searchBooks,
} from "../../services/http";
import userContext from "../../context/userContext";

function Person({ person }) {
  return (
    <Link
      to={`/profile/${person._id}`}
      target="_blank"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="search-person">
        <img
          src={person.profilePicture || "/images/profile.svg"}
          alt=""
          className="search-person__image"
        />
        <div className="search-person__details">
          <h3 className="person__name">{person.username}</h3>
          <h3 className="person__email">{person.email}</h3>
          <p className="person__desc">{person.desc}</p>
        </div>
      </div>
    </Link>
  );
}

function Video() {
  return <div></div>;
}

function Event({ event, user }) {
  return <EventPost event={event} currentUser={user} />;
}

function Product({ product }) {
  return <ProductPost product={product} isBook={false} />;
}

function Book({ book }) {
  return <ProductPost product={book} isBook={true} />;
}

function NotFound({ field }) {
  return <div className="search-not-found">No {field} matches your search</div>;
}

function Search({ query }) {
  const [option, setOption] = useState("people");
  const [people, setPeople] = useState([]);
  const videos = [];
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [books, setBooks] = useState([]);
  const { user } = useContext(userContext);

  const getClass = (currentOption) => {
    return currentOption === option && "search__option--active";
  };

  useEffect(() => {
    const fetchData = async () => {
      const people = await searchPeople(query);
      const events = await searchEvents(query);
      const products = await searchProducts(query);
      const books = await searchBooks(query);

      setPeople(people || []);
      setEvents(events || []);
      setProducts(products || []);
      setBooks(books || []);
    };

    fetchData();
  }, [query]);

  return (
    <section className="feed">
      <div className="feedWrapper">
        <ul className="search__options">
          <li
            className={`search__option ${getClass("people")}`}
            onClick={() => setOption("people")}
          >
            People
          </li>
          <li
            className={`search__option ${getClass("videos")}`}
            onClick={() => setOption("videos")}
          >
            Videos
          </li>
          <li
            className={`search__option ${getClass("events")}`}
            onClick={() => setOption("events")}
          >
            Events
          </li>
          <li
            className={`search__option ${getClass("products")}`}
            onClick={() => setOption("products")}
          >
            Products
          </li>
          <li
            className={`search__option ${getClass("books")}`}
            onClick={() => setOption("books")}
          >
            Books
          </li>
        </ul>
        {option === "people" && (
          <>
            {!people.length && <NotFound field="person" />}
            {people.map((person, index) => (
              <Person key={index} person={person} />
            ))}
          </>
        )}
        {option === "videos" && (
          <>
            {!videos.length && <NotFound field="video" />}
            {videos.map((video, index) => (
              <Video key={index} video={video} />
            ))}
          </>
        )}
        {option === "events" && (
          <>
            {!events.length && <NotFound field="event" />}
            {events.map((event, index) => (
              <Event key={index} event={event} user={user} />
            ))}
          </>
        )}
        {option === "products" && (
          <>
            {!products.length && <NotFound field="product" />}
            {products.map((product, index) => (
              <Product key={index} product={product} />
            ))}
          </>
        )}
        {option === "books" && (
          <>
            {!books.length && <NotFound field="book" />}
            {books.map((book, index) => (
              <Book key={index} book={book} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default Search;
