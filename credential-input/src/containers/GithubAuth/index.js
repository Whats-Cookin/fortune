import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks";
import { GithubIcon } from "../../Icons/GithubIcon";
import "./style.css";
import axios from "axios";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const GITHUB_AUTH_URL = process.env.REACT_APP_GITHUB_AUTH_URL;

const GithubAuth = (props) => {
  const { userAccount } = props;

  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const githubAuthCode = queryParams.get("code");

  const [isRequesting, setIsRequesting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (githubAuthCode && userAccount && !isRequesting) {
      const githubAuthUrl = `${BACKEND_BASE_URL}/auth/github`;
      setIsRequesting(true);
      axios
        .post(githubAuthUrl, {
          githubAuthCode,
          userAccount,
        })
        .then((res) => {
          setUserInfo({
            ...res.data.message,
          });
          navigate("/");
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
      {!isRequesting && !userInfo && (
        <>
          <a href={GITHUB_AUTH_URL} className="btn">
            <span className="text__wrapper">Share your Github public info</span>
            <div className="icon__wrapper">
              <GithubIcon />
            </div>
          </a>
        </>
      )}
      {!isRequesting && userInfo && (
        <pre>{JSON.stringify(userInfo, undefined, 2)}</pre>
      )}
      {isRequesting && <div>Loading...</div>}
    </div>
  );
};

export default GithubAuth;
