import React from "react";
import { Link } from "@remix-run/react";

function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <i className="fas fa-bolt"></i>
          <span> DS</span>
        </div>
        <nav>
          <ul>
            <li className="active">

              <i className="fas fa-home"></i>
              <span> <Link to="/app">Dashboard</Link> </span>
            </li>
            <li>
           
              <i className="fas fa-chart-line"></i>
              <span> <Link to="/app/analytics"> Analytics  </Link></span>
        
            </li>
            <li>
              <i className="fas fa-section"></i>
              <span> <Link to="/app/explore"> Explore</Link> </span> 
            </li>
            <li> 
              <i className="fas fa-cog"></i> 
              <span><Link to="/app/installation">Installation</Link> </span>
            </li>
            <li>
              <i className="fas fa-info"></i>
              <span> <Link to="/app/help"> Help</Link> </span>
            </li>
          </ul>
        </nav>
        {/* <div className="status">
          <div className="status-icon online"></div>
          <div className="status-text">Online</div>
        </div> */}
      </div>
    </>
  );
}

export default Sidebar; 
