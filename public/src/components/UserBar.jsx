import React from 'react';

const UserBar = ({isAuthenticated, photoUrl, username}) => (
  <div className="user-bar">
  	{isAuthenticated ? <img src={photoUrl}></img> :
  null	}
    {isAuthenticated ? <span>You are signed in as {username}</span> : 
    <span>You have not signed yet! Please login with facebook</span>}
  </div>
)

export default UserBar;