import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import notFoundImg from '../assets/404.png';  // ← Change this if your file is named differently

export const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-image">
          <img src={notFoundImg} alt="Page not found" />
        </div>

        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page not found</h2>
        <p className="not-found-desc">
          The page you're looking for doesn't exist wena!
        </p>

        <Link to="/" className="btn-primary not-found-btn">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};