import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks";
import { GithubIcon } from "../../Icons/GithubIcon";
import "./style.css";
import axios from "axios";

const Login = () => {
  const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
  const GITHUB_AUTH_URL = process.env.REACT_APP_GITHUB_AUTH_URL;
  const navigate = useNavigate();

  const handleAuth = useCallback((accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    navigate("/");
  }, []);

  const queryParams = useQueryParams();
  const githubAuthCode = queryParams.get("code");
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (githubAuthCode && !isRequesting) {
      console.log("Calling github >>>");
      const githubAuthUrl = `${BACKEND_BASE_URL}/auth/github`;
      setIsRequesting(true);
      axios
        .post(githubAuthUrl, {
          githubAuthCode,
        })
        .then((res) => {
          const { accessToken, refreshToken } = res.data;
          handleAuth(accessToken, refreshToken);
        })
        .catch((err) => {
          console.error(err.message);
        })
        .finally(() => {
          setIsRequesting(false);
        });
    }
  }, []);

  return (
    <div>
      <a href={GITHUB_AUTH_URL} className="btn">
        <span className="text__wrapper">Login with Github</span>
        <div className="icon__wrapper">
          <GithubIcon />
        </div>
      </a>
    </div>
  );
};

export default Login;
