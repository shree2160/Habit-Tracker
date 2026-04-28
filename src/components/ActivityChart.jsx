import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActivityChart = ({ days = 7 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      const dates = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }

      const { data } = await supabase
        .from('habit_logs')
        .select('date')
        .eq('completed', true)
        .gte('date', dates[0])
        .lte('date', dates[days - 1]);

      // Group counts by date
      const counts = dates.map(date => {
        return data?.filter(log => log.date === date).length || 0;
      });

      setChartData({
        labels: dates.map(d => {
          const dateObj = new Date(d);
          return days > 7 
            ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        }),
        datasets: [
          {
            label: 'Completed Habits',
            data: counts,
            backgroundColor: '#7C3AED',
            borderRadius: days > 7 ? 4 : 8,
          },
        ],
      });
      setLoading(false);
    };

    fetchActivity();
  }, [days]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#94A3B8',
        bodyColor: '#FFFFFF',
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94A3B8' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      x: {
        ticks: { color: '#94A3B8' },
        grid: { display: false }
      }
    }
  };

  if (loading) return <p>Loading chart...</p>;

  return (
    <div style={{ height: '200px', width: '100%' }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default ActivityChart;
