import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ onLogout, userPic }) => {
  const fallbackAvatar = "https://ui-avatars.com/api/?name=User&background=00ffff&color=000";

  return (
    <div className="avatar-container">
      <img
        src={userPic || fallbackAvatar}
        alt="User"
        className="user-avatar"
      />
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default UserAvatar;
