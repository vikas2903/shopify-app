import React, { useEffect, useState } from 'react';
import ChartsGraph from './ChartsGraph.jsx'; // Assuming you have a Chart component for displaying charts

function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            let tries = 0;

            while (tries < 3) {
                try {
                    const res = await fetch('https://shopify-wishlist-app-mu3m.onrender.com/api/dashboard',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }
                    );
                    const result = await res.json();

                    if (result.success) {
                        setData(result);
                        setError("");
                        break;
                    } else {
                        setError("Failed to load dashboard data.");
                        break;
                    }
                } catch (err) {
                    console.error(`Fetch attempt ${tries + 1} failed:`, err);
                    tries++;
                    if (tries < 3) {
                        await new Promise(res => setTimeout(res, 2000)); // Wait 2s before retry
                    } else {
                        setError("Error fetching data after multiple attempts.");
                    }
                }
            }

            setLoading(false);
        };

        fetchDashboard();
    }, []);

    return (
        <div className="main-content">
            <div className="content">
                <h1>Dashboard</h1>

                {loading && <p>Loading or waking up server...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {data && (
                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="stat-icon users">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-details">
                                <h3>Total Orders</h3>
                                <div className="stat-number">{data.totalOrderCount}</div>
                                <div className="stat-trend positive">
                                    {/* <i className="fas fa-arrow-up"></i>
                  <span>+ Recent View Section</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon revenue">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-details">
                                <h3>Total Products</h3>
                                <div className="stat-number">{data.productCount}</div>
                                <div className="stat-trend positive">
                                    {/* <i className="fas fa-arrow-up"></i>
                  <span>+ Wishlist App</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orders">
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <div className="stat-details">
                                <h3>Total Customers</h3>
                                <div className="stat-number">{data.customerCount}</div>
                                <div className="stat-trend negative">
                                    {/* <i className="fas fa-arrow-down"></i>
                  <span>-2</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orders">
                                <i className="fas fa-percentage"></i>
                            </div>
                            <div className="stat-details">
                                <h3>Conversion Rate</h3>
                                <div className="stat-number">{data.conversionRate}</div>
                                <div className="stat-trend positive">
                                    {/* <i className="fas fa-arrow-up"></i>
                  <span>Improved</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                < ChartsGraph />

            </div>
        </div>
    );
}

export default Home;
