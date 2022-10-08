import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./containers/Login";
import "./App.css";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) return true;
    return false;
  };

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated && location.pathname === "/") {
      navigate("/login");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;

function Homepage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <button className="btn" onClick={handleLogout}>
      Logout
    </button>
  );
}
