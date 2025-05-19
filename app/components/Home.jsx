import React from 'react'

function Homee() {
  return (
    <>
             <div className="main-content">
    

                <div className="content">
                    <h1>Dashboard</h1>

                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="stat-icon users">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-details">
                                <h3>Total Blocks</h3>
                                <div className="stat-number">10</div>
                                <div className="stat-trend positive">
                                    <i className="fas fa-arrow-up"></i>
                                    <span>+ Recent View Section</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon revenue">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-details">
                                <h3>App</h3>
                                <div className="stat-number">01</div>
                                <div className="stat-trend positive">
                                    <i className="fas fa-arrow-up"></i>
                                    <span>+ Wishlist App</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orders">
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <div className="stat-details">
                                <h3>Installed Section</h3>
                                <div className="stat-number">10</div>
                                <div className="stat-trend negative">
                                    <i className="fas fa-arrow-down"></i>
                                    <span>+2</span> 
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="recent-activity">
                        <div className="section-header">
                            <h2>Recent Activity</h2>
                            {/* <button className="view-all">View All</button> */}
                        </div>

                        {/* <div className="activity-card">
                            <div className="activity-icon green">
                                <i className="fas fa-check"></i>
                            </div>
                            <div className="activity-details">
                                <h4>Project Alpha completed</h4>
                                <p>Team finished the project ahead of
                                    schedule</p>
                                <div className="activity-time">2 hours ago</div>
                            </div>
                        </div>

                        <div className="activity-card">
                            <div className="activity-icon blue">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <div className="activity-details">
                                <h4>New team member</h4>
                                <p>Emily Jones joined the design team</p>
                                <div className="activity-time">5 hours ago</div>
                            </div>
                        </div>

                        <div className="activity-card">
                            <div className="activity-icon orange">
                                <i className="fas fa-comments"></i>
                            </div>
                            <div className="activity-details">
                                <h4>Client meeting</h4>
                                <p>Discussion about the new project
                                    requirements</p>
                                <div className="activity-time">Yesterday</div>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* <footer>
                    <div className="copyright">© 2025 Pulse Dashboard</div>
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact Us</a>
                    </div>
                </footer> */}
            </div>
    </>
  )
}

export default Homee




