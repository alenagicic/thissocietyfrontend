import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { apiCall } from '../Utils/api';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const userLoggedIn = !!user;

  // Function to toggle the navigation menu
  const toggleNavbar = () => {
    setIsNavVisible(prev => !prev);
  };

  // Function to handle link clicks and signout
  const handleAction = async (actionType) => {
    if (actionType === 'signout') {
      try {
        await apiCall('/api/account/signout', 'POST');
        logout();
      } catch (error) {
        console.error('Error signing out:', error.message || error);
        // User feedback logic here
      }
    } else {
      // This is the new logic: when a link is clicked, scroll to top.
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    
    // Close the navbar for all actions
    setIsNavVisible(false);
  };

  const navLinks = [
    { to: '/', icon: 'bi-house', label: 'Home' },
    { to: '/content/main/latest', icon: 'bi-layout-text-window-reverse', label: 'Content' },
  ];

  const loggedInLinks = [
    { to: '/create', icon: 'bi-plus-circle', label: 'Create' },
    { to: '/notifications', icon: 'bi-bell', label: 'Notifications' },
    { to: '/settings', icon: 'bi-gear', label: 'Settings' },
  ];
  
  return (
    <div className="wrapper-header">
      {/* Toggle button */}
      <button className={`header-toggler ${isNavVisible ? 'left' : ''}`} onClick={toggleNavbar}>
        <i className={`bi ${isNavVisible ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {/* The navigation menu with conditional visibility */}
      <div className={`wrapper-header-nav ${isNavVisible ? 'is-visible' : ''}`}>
        {/* Render base navigation links */}
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => handleAction('link')}>
            <button aria-label={link.label}>
              <i className={`${link.icon} text-lg`}></i>
            </button>
          </Link>
        ))}

        {userLoggedIn ? (
          <>
            {/* Render logged-in links */}
            {loggedInLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => handleAction('link')}>
                <button aria-label={link.label}>
                  <i className={`${link.icon} text-lg`}></i>
                </button>
              </Link>
            ))}
            {/* Sign-out button */}
            <button onClick={() => handleAction('signout')} aria-label="Sign out">
              <i className="bi-box-arrow-in-left text-lg"></i>
            </button>
          </>
        ) : (
          /* Render logged-out link */
          <Link to="/auth" onClick={() => handleAction('link')}>
            <button aria-label="Sign in">
              <i className="bi-box-arrow-in-right text-lg"></i>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}