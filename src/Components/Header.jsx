import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { apiCall } from '../Utils/api';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const userLoggedIn = !!user;

  const toggleNavbar = () => {
    setIsNavVisible(prev => !prev);
  };

  const handleAction = async (actionType) => {
    if (actionType === 'signout') {
      try {
        await apiCall('/account/signout', 'POST');
        logout();
      } catch (error) {
        console.error('Error signing out:', error.message || error);
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    
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

      <div className={`wrapper-header-nav ${isNavVisible ? 'is-visible' : ''}`}>
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => handleAction('link')}>
            <button aria-label={link.label}>
              <i className={`${link.icon} text-lg`}></i>
            </button>
          </Link>
        ))}

        {userLoggedIn ? (
          <>
            {loggedInLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => handleAction('link')}>
                <button aria-label={link.label}>
                  <i className={`${link.icon} text-lg`}></i>
                </button>
              </Link>
            ))}
            <button onClick={() => handleAction('signout')} aria-label="Sign out">
              <i className="bi-box-arrow-in-left text-lg"></i>
            </button>
          </>
        ) : (
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