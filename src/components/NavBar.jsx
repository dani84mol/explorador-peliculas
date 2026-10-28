import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Se utilizan enlaces <Link> para evitar recargas completas de la SPA (Single Page App) */}
        <Link to="/">PelículasApp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favoritos</Link>
      </div>
    </nav>
  );
}