import React from 'react';

const UserBar = ({isAuthenticated, photoUrl, username, debt, entitlement}) => (
  <div className='user-bar'>
  	{isAuthenticated ? <img src={photoUrl}></img> :
  	<img src="https://qsf.ec.quoracdn.net/-3-images.new_grid.profile_pic_default_small.png-26-902da2b339fedf49.png"></img>}
    {isAuthenticated ? <p>Welcome <strong>{username}</strong>!<br />
    Your Entitlement: {entitlement !== null ? '$' + entitlement : 'unavailable'}<br /> 
    Your Debt: {debt !== null ? '$' + debt : 'unavailable'}</p> : 
    <p>You have not signed yet! Please login with facebook</p>}
  </div>
)

export default UserBar;