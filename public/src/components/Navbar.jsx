import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import UserBar from './UserBar.jsx';

const Navbar = ({isAuthenticated, handleClickLogout, sideMenuState, menuOnClick, username, photoUrl, debt, entitlement}) => (
  <header>
    <div className='navbar-component'>
      <a href="#" onClick={menuOnClick} className='menu-icon'></a>
      <Link to="/" className='brand'>Diff</Link>
      <nav className='menu'>
        <UserBar isAuthenticated={isAuthenticated} username={username} photoUrl={photoUrl} debt={debt} entitlement={entitlement} />
        <Link to="/profile" className='link'>My Profile</Link>
        <Link to="/" className='link'>Create a new Trip</Link>
        <Link to="/recent-trips" className='link'>Recent Trips</Link>
        <Link to="/notifications" className='link'>Notifications</Link>
        {isAuthenticated ? null : <Link to="/login" className='link'>Login</Link>}
        {!isAuthenticated ? null : <Link to="/logout" onClick={handleClickLogout} className='link'>Logout</Link>}
      </nav>
    </div>
  </header>
)

export default Navbar;

//<Link to="/upload-receipt" className='link'>Upload Receipt</Link>
//<Link to="/profile" className='link'>Profile</Link>
//<Link to="/additems" className='link'>Add Items</Link>
//<Link to="/summary" className='link'>Member Summary</Link>
//<Link to="/create-trip" className='link'>Create Trip</Link>
