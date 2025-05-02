import React from "react";
import '../assets/script/index.js'

function Header() {
  return (
    <> 
      <header> 
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="user-profile">
          <div className="notifications">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </div>
          <div className="avatar">V</div>
        </div>
      </header>
      
      
    </>
  );
}

export default Header;
