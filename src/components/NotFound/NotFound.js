import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = '404 | Kerem Burak Yılmaz';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <section className="not-found" aria-labelledby="not-found-heading">
      <div className="not-found__meta">
        <span>HTTP / 404</span>
        <span>ROUTE UNRESOLVED</span>
      </div>

      <div className="not-found__body">
        <span className="not-found__code" aria-hidden="true">404</span>
        <div>
          <h1 id="not-found-heading">This path does not belong to the system.</h1>
          <p>
            Nothing is running at <code>{location.pathname}</code>. The address may
            have moved, expired, or never existed.
          </p>
          <nav aria-label="404 recovery links">
            <Link to="/">RETURN HOME <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <Link to="/lab">ENTER THE LAB <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </nav>
        </div>
      </div>

      <div className="not-found__footer">
        <span>NO PROCESS FOUND</span>
        <span>KEREMBURAKYILMAZ.COM</span>
      </div>
    </section>
  );
}
