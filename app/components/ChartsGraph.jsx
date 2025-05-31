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
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('https://shopify-wishlist-app-mu3m.onrender.com/api/dashboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shop: 'your-shop-name.myshopify.com',
            token: 'your-shopify-access-token',
          }),
        });
        const result = await res.json();
        if (result.success) {
          setData(result);
        } else {
          setError('Failed to load dashboard data.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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

  if (loading) return <p>Loading charts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data) return null;

  const conversionRate = parseFloat(data.conversionRate) || 0;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Dashboard Analytics</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        justifyContent: 'center',
      }}>
        {/* Orders Today - Line Chart */}
        <div style={{ width: '45%', minWidth: '300px' }}>
          <h4>Orders Today</h4>
          <Line
            data={{
              labels: ['Today'],
              datasets: [{
                label: 'Orders',
                data: [data.orderTodayCount],
                borderColor: '#4bc0c0',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
              }],
            }}
            options={chartOptions}
          />
        </div>

        {/* Products - Bar Chart */}
        <div style={{ width: '45%', minWidth: '300px' }}>
          <h4>Total Products</h4>
          <Bar
            data={{
              labels: ['Products'],
              datasets: [{
                label: 'Products',
                data: [data.productCount],
                backgroundColor: '#9966ff',
                borderColor: '#7c4dff',
                borderWidth: 1,
              }],
            }}
            options={chartOptions}
          />
        </div>

        {/* Customers - Line Chart */}
        <div style={{ width: '45%', minWidth: '300px' }}>
          <h4>Total Customers</h4>
          <Line
            data={{
              labels: ['Customers'],
              datasets: [{
                label: 'Customers',
                data: [data.customerCount],
                borderColor: '#ff9f40',
                backgroundColor: 'rgba(255,159,64,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
              }],
            }}
            options={chartOptions}
          />
        </div>

        {/* Conversion Rate - Bar Chart */}
        <div style={{ width: '45%', minWidth: '300px' }}>
          <h4>Conversion Rate (%)</h4>
          <Bar
            data={{
              labels: ['Conversion Rate'],
              datasets: [{
                label: 'Conversion Rate',
                data: [conversionRate],
                backgroundColor: '#ff6384',
                borderColor: '#e91e63',
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
ChartsGraph