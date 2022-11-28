import { useCallback, useState } from "react";
import { FiverrIcon } from "../../Icons/FiverrIcon";
import "./style.css";
import axios from "axios";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const FiverrPage = (props) => {
  const { userAccount } = props;

  const [isRequestingMagicLink, setIsRequestingMagicLink] = useState(false);
  const [isRequestingFiverrLink, setIsRequestingFiverrLink] = useState(false);
  const [magicLink, setMagicLink] = useState();
  const [textCopy, setTextCopy] = useState("Copy");
  const [result, setResult] = useState();

  const copyLink = useCallback(() => {
    // Get the text field
    var copyText = document.getElementById("magicLink");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    setTextCopy("Copied");

    setTimeout(() => {
      setTextCopy("Copy");
    }, 3000);
  }, []);

  const getLink = useCallback(() => {
    if (userAccount) {
      setIsRequestingMagicLink(true);
      const getFiverrMagicLink = `${BACKEND_BASE_URL}/get-fiverr-magic-link?user_account=${userAccount}`;
      axios
        .get(getFiverrMagicLink)
        .then((res) => {
          setMagicLink(res.data.message);
        })
        .catch((err) => {
          console.error(err.message);
          setMagicLink("link_test");
        })
        .finally(() => {
          setIsRequestingMagicLink(false);
        });
    }
  }, [userAccount]);

  const sendLink = useCallback((e) => {
    e.preventDefault();
    setIsRequestingFiverrLink(true);
    var url = document.getElementById("fiverrLink").value;
    const sendFiverrLink = `${BACKEND_BASE_URL}/fiverr-url/`;
    axios
      .post(sendFiverrLink, { url })
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => {
        console.error(err.message);
        setResult({ test: "result" });
      })
      .finally(() => {
        setIsRequestingFiverrLink(false);
      });
  }, []);

  return (
    <div>
      {userAccount && (
        <>
          <p>1. Get Magic Link</p>
          <button
            disabled={isRequestingMagicLink}
            onClick={getLink}
            className="btn"
          >
            <span className="text__wrapper">
              {isRequestingMagicLink ? "Loading..." : "Get the magic link"}
            </span>
            <div className="icon__wrapper">
              <FiverrIcon />
            </div>
          </button>

          <p>2. Copy and paste this magic link into your Fiverr profile</p>
          <div>
            <input id="magicLink" value={magicLink} readOnly />
            <button onClick={copyLink} disabled={!magicLink}>
              {textCopy}
            </button>
          </div>
          <p style={{ color: "#0008" }}>
            keep it until we are done getting your fiverr ratings and info.
          </p>
          <p>
            3. Then share your public profile url in the below box and confirm
          </p>
          <form onSubmit={sendLink}>
            <input
              pattern="^https://www.fiverr.com/(.*)$"
              placeholder="https://www.fiverr.com/chirag8838"
              id="fiverrLink"
            />
            <button type="submit" disabled={isRequestingFiverrLink}>
              {isRequestingFiverrLink ? "Loading..." : "Confirm"}
            </button>
          </form>
        </>
      )}
      {result && <pre>{JSON.stringify(result, undefined, 2)}</pre>}
    </div>
  );
};

export default FiverrPage;
