import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { apiCall } from '../Utils/api';

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const [isNavVisible, setIsNavVisible] = useState(false);
    const userLoggedIn = !!user;
    const navRef = useRef(null);
    const toggleButtonRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target) && toggleButtonRef.current && !toggleButtonRef.current.contains(event.target)) {
                setIsNavVisible(false);
            }
        };

        if (isNavVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNavVisible]);

    const navLinks = [
        { to: '/', icon: 'bi-house', label: 'Home', tooltip: 'Home' },
        { to: '/content/main/latest', icon: 'bi-layout-text-window-reverse', label: 'Content', tooltip: 'Content' },
    ];

    const loggedInLinks = [
        { to: '/create', icon: 'bi-plus-circle', label: 'Create', tooltip: 'Create' },
        { to: '/notifications', icon: 'bi-bell', label: 'Notifications', tooltip: 'Notifications' },
        { to: '/settings', icon: 'bi-gear', label: 'Settings', tooltip: 'Settings' },
    ];
    
    return (
        <>
            <button
                className="header-toggler"
                onClick={toggleNavbar}
                ref={toggleButtonRef}
                title={isNavVisible ? 'Close Menu' : 'Open Menu'}
            >
                <i className={`bi ${isNavVisible ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>

            <div className={`wrapper-header-nav ${isNavVisible ? 'is-visible' : ''}`} ref={navRef}>
                {navLinks.map((link) => (
                    <Link className='link-element' key={link.to} to={link.to} onClick={() => handleAction('link')}>
                        <button aria-label={link.label}>
                            <i className={`${link.icon} text-lg`}></i>
                            <span className="tooltip">{link.tooltip}</span>
                        </button>
                    </Link>
                ))}

                {userLoggedIn ? (
                    <>
                        {loggedInLinks.map((link) => (
                            <Link className='link-element' key={link.to} to={link.to} onClick={() => handleAction('link')}>
                                <button aria-label={link.label}>
                                    <i className={`${link.icon} text-lg`}></i>
                                    <span className="tooltip">{link.tooltip}</span>
                                </button>
                            </Link>
                        ))}
                        <Link className='link-element' to="#" onClick={() => handleAction('signout')}>
                            <button aria-label="Sign out">
                                <i className="bi-box-arrow-in-left text-lg"></i>
                                <span className="tooltip">Sign out</span>
                            </button>
                        </Link>
                    </>
                ) : (
                    <Link className='link-element' to="/auth" onClick={() => handleAction('link')}>
                        <button aria-label="Sign in">
                            <i className="bi-box-arrow-in-right text-lg"></i>
                            <span className="tooltip">Sign in</span>
                        </button>
                    </Link>
                )}
            </div>
        </>
    );
}