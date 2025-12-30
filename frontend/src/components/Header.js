import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header>
      <h1>Task Manager</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
