import React from 'react';

const UserBar = ({photoUrl, username}) => (
  <div className="user-bar">
  	<img src={photoUrl}></img>
    You are signed in as {username}
  </div>
)

export default UserBar;