import "./style.css";
import { FiverrIcon } from "../../Icons/FiverrIcon";
import { Link } from "react-router-dom";

const FiverrAuth = () => {
  return (
    <div>
      <Link to="/cred/fiverr" className="btn">
        <span className="text__wrapper">Add your fiverr ratings</span>
        <div className="icon__wrapper">
          <FiverrIcon />
        </div>
      </Link>
    </div>
  );
};

export default FiverrAuth;
