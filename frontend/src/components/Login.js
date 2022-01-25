import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../utils/constants";
import user from "../reducers/user";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState("");

  const accessToken = useSelector((store) => store.user.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setError(data.response));
          });
          setError("Sorry, this is an invalid username or password");
        }
      });
  };

  return (
    <>
      <div className="main-container">
        <div className="btn-container">
          {mode === "signin" ? (
            <div className="sign-btn-container">
              <button
                className="sign-btn"
                type="submit"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>{" "}
              <p className="action-title">Sign in here</p>
            </div>
          ) : (
            <div>
              <div>
                <button
                  className="sign-btn"
                  type="submit"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </div>
              <div>
                <p className="action-title">Sign up here</p>
              </div>
            </div>
          )}
        </div>
        <div className="form-container">
          <form onSubmit={onFormSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p>{error}</p>
            {mode === "signin" ? (
              <button className="submit-btn" type="submit">
                Sign in
              </button>
            ) : (
              <button className="submit-btn" type="submit">
                Sign up
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
