import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaBell, FaSignOutAlt, FaChevronDown, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Header.css';

const Header = ({ user }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedPassword');
    navigate('/signin');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Expense Tracker</h1>
        </div>

        <div className="header-right">
          {/* Profile Summary - Always visible */}
          {showProfileDetails && (
            <div className="profile-summary">
              <div className="profile-avatar">
                <FaUser />
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name || 'User'}</span>
                <span className="profile-role">{user?.role || 'Member'}</span>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span>
          </div>

          {/* Settings */}
          <div className="settings-dropdown">
            <button 
              className="settings-button"
              onClick={() => setShowSettings(!showSettings)}
            >
              <FaCog />
            </button>
            {showSettings && (
              <div className="dropdown-menu settings-menu">
                <button onClick={() => navigate('/profile')}>Edit Profile</button>
                <button onClick={() => navigate('/preferences')}>Preferences</button>
                <button onClick={() => navigate('/notifications')}>Notification Settings</button>
                <button onClick={() => navigate('/security')}>Security</button>
                <div className="menu-divider"></div>
                <button 
                  onClick={() => setShowProfileDetails(!showProfileDetails)}
                  className="toggle-profile-details"
                >
                  {showProfileDetails ? (
                    <>
                      <FaEyeSlash /> Hide Profile Details
                    </>
                  ) : (
                    <>
                      <FaEye /> Show Profile Details
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="profile-dropdown">
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                <FaUser />
              </div>
              <span className="profile-name">{user?.name || 'User'}</span>
              <FaChevronDown />
            </button>
            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="profile-info">
                  <div className="profile-avatar-large">
                    <FaUser />
                  </div>
                  <div className="profile-details">
                    <h3>{user?.name || 'User'}</h3>
                    <p>{user?.email || 'user@example.com'}</p>
                    <p className="profile-role">{user?.role || 'Member'}</p>
                    <p className="profile-join-date">Member since: {user?.joinDate || '2024'}</p>
                  </div>
                </div>
                <div className="menu-divider"></div>
                <button onClick={() => navigate('/profile')}>View Profile</button>
                <button onClick={() => navigate('/settings')}>Settings</button>
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 