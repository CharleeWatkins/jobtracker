import { Link } from 'react-router-dom';
import { Briefcase, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import laptopImg from '../assets/laptop.png';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo height={32} />
        </Link>
        <div className="landing-nav-links">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-text">
          <h1>
            Track Your Job <span>Applications</span>
          </h1>
          <p>
           Keep every role, deadline, and follow-up organized in one
            clean workspace so you can focus on the next goal.
          </p>

          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="btn-primary"
            style={{ display: 'inline-flex' }}
          >
            Get Started
          </Link>

          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <Briefcase size={18} />
              </div>
              <h3>Track Applications</h3>
              <p>Store every application with company details, duties, and dates.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <Target size={18} />
              </div>
              <h3>Monitor Status</h3>
              <p>See at a glance what's applied, interviewing, or rejected.</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <TrendingUp size={18} />
              </div>
              <h3>Stay Organized</h3>
              <p>Search, filter, and sort to see your progress and next steps.</p>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual">
          <img src={laptopImg} alt="Job tracking illustration" />
        </div>
      </section>
    </div>
  );
};