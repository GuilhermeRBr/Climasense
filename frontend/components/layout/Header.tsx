import Link from 'next/link';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">ClimaSense</h1>
        <nav className="header-nav">
          <Link href="/" className="nav-link">
            Dashboard
          </Link>
          <Link href="/previsao" className="nav-link">
            Previsao
          </Link>
        </nav>
      </div>
    </header>
  );
}
