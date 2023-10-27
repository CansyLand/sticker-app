import { Link } from 'react-router-dom';

function Navbar() {
 
  return (
    <div className="navbar bg-base-100">
    <div className="flex-1">
      <Link className="btn btn-ghost normal-case text-xl" to="/">Privatsachen Sticker App</Link>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">
        <li><Link to="/translation">Übersetzungen</Link></li>
        <li>
          <details>
            <summary>
              Parent
            </summary>
            <ul className="p-2 bg-base-100">
              <li><a to="/">Link 1</a></li>
              <li><a to="/translation">Link 2</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
  );
}

export default Navbar;