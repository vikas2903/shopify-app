import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const ChartsGraph = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const endpoint = `https://shopify-wishlist-app-mu3m.onrender.com/api/dashboard?range=${range}`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (result.success) {
        setData(result);
      } else {
        console.error('API responded with success: false');
        setData(null);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p style={{ color: 'red' }}>Failed to load data.</p>;

  const {
    dayWiseData = [],
    orderTodayCount,
    totalOrderCount,
    productCount,
    customerCount,
  } = data;

  const chartLabels = dayWiseData.map(d => d.date);
  const orderData = dayWiseData.map(d => d.orders);
  const revenueData = dayWiseData.map(d => d.revenue);
  const conversionData = dayWiseData.map(d => parseFloat(d.conversionRate));

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard Analytics</h2>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <label htmlFor="range"><strong>Trend Range:</strong>&nbsp;</label>
        <select
          id="range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="1d">1 Day</option>
          <option value="7d">7 Days</option>
          <option value="1m">1 Month</option>
          <option value="1y">1 Year</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div>
          <h4>Order Trends</h4>
          <Line
            data={{
              labels: chartLabels,
              datasets: [{
                label: 'Orders',
                data: orderData,
                borderColor: '#4bc0c0',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
              }],
            }}
            options={chartOptions}
          />
        </div>

        <div>
          <h4>Revenue Trends</h4>
          <Line
            data={{
              labels: chartLabels,
              datasets: [{
                label: 'Revenue',
                data: revenueData,
                borderColor: '#36a2eb',
                backgroundColor: 'rgba(54,162,235,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
              }],
            }}
            options={chartOptions}
          />
        </div>

        <div>
          <h4>Conversion Rate (%)</h4>
          <Bar
            data={{
              labels: chartLabels,
              datasets: [{
                label: 'Conversion Rate',
                data: conversionData,
                backgroundColor: '#ff6384',
                borderColor: '#e91e63',
                borderWidth: 1,
              }],
            }}
            options={chartOptions}
          />
        </div>

        <div>
          <h4>Today’s Orders</h4>
          <Bar
            data={{
              labels: ['Today'],
              datasets: [{
                label: 'Orders Today',
                data: [orderTodayCount],
                backgroundColor: '#81c784',
                borderColor: '#388e3c',
                borderWidth: 1,
              }],
            }}
            options={chartOptions}
          />
        </div>

        <div>
          <h4>Total Orders</h4>
          <Bar
            data={{
              labels: ['Total'],
              datasets: [{
                label: 'Total Orders',
                data: [totalOrderCount],
                backgroundColor: '#36a2eb',
                borderColor: '#1e88e5',
                borderWidth: 1,
              }],
            }}
            options={chartOptions}
          />
        </div>

        <div>
          <h4>Total Products</h4>
          <Bar
            data={{
              labels: ['Products'],
              datasets: [{
                label: 'Products',
                data: [productCount],
                backgroundColor: '#9966ff',
                borderColor: '#7c4dff',
                borderWidth: 1,
              }],
            }}
            options={chartOptions}
          />
        </div>

        <div>
          <h4>Total Customers</h4>
          <Bar
            data={{
              labels: ['Customers'],
              datasets: [{
                label: 'Customers',
                data: [customerCount],
                backgroundColor: '#ff9f40',
                borderColor: '#ff7043',
                borderWidth: 1,
              }],
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsGraph;
