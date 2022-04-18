import "./feed.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cancel } from "@material-ui/icons";
import { format } from "timeago.js";
import {
  getUser,
  getProducts,
  getBooks,
  postProduct,
  createConversation,
} from "../../services/http";
import userContext from "../../context/userContext";

export function ProductPost({ product, isBook, currentUser, setFeed }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(product.userId);
      setUser(user);
    };

    fetchUser();
  }, [product]);

  const handleContact = async () => {
    if (currentUser._id === user._id) return;
    if (currentUser.friends?.includes(user._id)) return;

    await createConversation(currentUser._id, user._id);
    setFeed("chats");
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
            <span className="postDate">{format(product.createdAt)}</span>
          </div>
        </div>
        <div className="postCenter">
          <div className="postText postDetail">
            <span className="detailHeading">{isBook ? "Book" : "Product"}</span>{" "}
            {product.name}
          </div>
          <div className="postText postDetail">
            <span className="detailHeading">Units</span> {product.units}
          </div>
          <div className="postText postDetail">
            <span className="detailHeading">Price</span> {product.price}
          </div>
          <div className="postText postDetail">
            <span className="detailHeading">Description</span> {product.desc}
          </div>
          {product.img && <img className="postImg" src={product.img} alt="" />}
        </div>
        <div className="postBottom">
          <button className="productMessage" onClick={handleContact}>
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products({ isBook, setFeed }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [units, setUnits] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState(null);
  const [desc, setDesc] = useState("");
  const { user: currentUser } = useContext(userContext);

  useEffect(() => {
    const fetchProducts = async () => {
      let products;
      if (isBook) products = await getBooks();
      else products = await getProducts();
      setProducts(products);
    };

    fetchProducts();
  }, [isBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(name && price && units !== "" && img && desc)) {
      console.log("running");
      return;
    }

    let product = new FormData();
    product.append("userId", currentUser._id);
    product.append("name", name);
    product.append("units", units);
    product.append("price", price);
    product.append("img", img);
    product.append("desc", desc);
    product.append("isBook", isBook);

    product = await postProduct(product);
    setProducts([product, ...products]);
  };

  return (
    <section className="feed">
      <div className="feedWrapper">
        <form
          className="eventPost"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <h3 className="eventPostHeading">
            Sell A {isBook ? "Book" : "Product"}
          </h3>
          <div className="productInputGroup">
            <div className="textInputGroup">
              <input
                type="text"
                className="eventField"
                placeholder={`${isBook ? "Book" : "Product"}...`}
                value={name}
                onChange={({ currentTarget }) => setName(currentTarget.value)}
                autoFocus
              />
              <input
                type="number"
                className="eventField"
                value={units}
                onChange={({ currentTarget }) => setUnits(currentTarget.value)}
                placeholder="Units..."
              />
              <input
                type="text"
                className="eventField"
                value={price}
                onChange={({ currentTarget }) => setPrice(currentTarget.value)}
                placeholder="Price..."
              />
              <input
                type="text"
                className="eventField"
                value={desc}
                onChange={({ currentTarget }) => setDesc(currentTarget.value)}
                placeholder="Description..."
              />
            </div>
            <div className="imageInputGroup">
              <label htmlFor="productImage" className="productImageBtn">
                Add Image
                <input
                  type="file"
                  id="productImage"
                  onChange={({ currentTarget }) =>
                    setImg(currentTarget.files[0])
                  }
                />
              </label>
              {img && (
                <div className="productImgContainer">
                  <img
                    className="productImg"
                    src={URL.createObjectURL(img)}
                    alt=""
                  />
                  <Cancel
                    className="productCancelImg"
                    onClick={() => setImg(null)}
                  />
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="eventPostButton">
            Register
          </button>
        </form>
        {products.map((product, index) => (
          <ProductPost
            key={index}
            product={product}
            isBook={isBook}
            currentUser={currentUser}
            setFeed={setFeed}
          />
        ))}
      </div>
    </section>
  );
}
