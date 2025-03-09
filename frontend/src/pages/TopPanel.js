import { Link } from "react-router-dom";
import "../App.css";

const TopPanel = () => {
  return (
    <nav className="container-fluid navbar top_logo">
      <div className="container">
        <Link to="/" className="logo">
          <h1>Nirvana</h1>
        </Link>
      </div>
    </nav>
  );
};
export default TopPanel;
