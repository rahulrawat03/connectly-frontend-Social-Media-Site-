import { useContext, useRef } from "react";
import "../register/register.css";
import { useNavigate } from "react-router-dom";
import { setSessionStart } from "../../services/localStorage";
import userContext from "../../context/userContext";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    let user = {
      email: email.current.value,
      password: password.current.value,
    };

    await setUser(user, true);
    setSessionStart();
  };

  const handleRegister = () => {
    navigate("/");
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <img src="/images/logo.svg" alt="app logo" className="appLogo" />
          <h3 className="loginLogo">Connectly</h3>
          <span className="loginDesc">
            Connect with people around the globe.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
              autoFocus
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit">
              Log in
            </button>
            <button className="loginRegisterButton" onClick={handleRegister}>
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
