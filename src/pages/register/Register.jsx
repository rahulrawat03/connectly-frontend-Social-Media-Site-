import { useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../../services/http";
import userContext from "../../context/userContext";
import { setSessionStart } from "../../services/localStorage";
import "./register.css";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await registerUser(user);
        delete user.username;

        setUser(user, true);
        setSessionStart();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <img src="/images/logo.svg" alt="appLogo" className="appLogo" />
          <h3 className="loginLogo">Connectly</h3>
          <span className="loginDesc">
            Connect with people around the globe
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
              autoFocus
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton" onClick={handleLogin}>
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
