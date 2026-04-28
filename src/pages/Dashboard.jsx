import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import HabitCard from '../components/HabitCard';
import ActivityChart from '../components/ActivityChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState(7);

  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch habits
    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    // Fetch today's logs
    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('date', today);

    setHabits(habitsData || []);
    setLogs(logsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const completedCount = logs.filter(l => l.completed).length;
  const totalCount = habits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <p style={{ marginBottom: '0.25rem' }}>Welcome back,</p>
        <h1>{user?.email?.split('@')[0] || 'Athlete'}</h1>
      </header>

      {/* Daily Summary Card */}
      <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, var(--accent-violet), #4C1D95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem', color: 'white' }}>Daily Progress</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>{completedCount} of {totalCount} habits completed</p>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>{percentage}%</div>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: 'white', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Today's Habits</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {habits.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ marginBottom: '1.5rem' }}>No habits created yet. Start by adding some discipline to your routine!</p>
            <button className="btn btn-primary" onClick={() => window.location.href='/habits'}>Create First Habit</button>
          </div>
        ) : (
          habits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              log={logs.find(l => l.habit_id === habit.id)}
              onToggle={fetchData}
            />
          ))
        )}
      </section>

      {/* Activity Chart */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Analytics</h2>
          <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '0.5rem', padding: '0.25rem' }}>
            <button 
              onClick={() => setChartDays(7)}
              style={{ 
                padding: '0.25rem 0.75rem', 
                fontSize: '0.75rem', 
                border: 'none', 
                borderRadius: '0.375rem',
                background: chartDays === 7 ? 'var(--accent-violet)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >7D</button>
            <button 
              onClick={() => setChartDays(30)}
              style={{ 
                padding: '0.25rem 0.75rem', 
                fontSize: '0.75rem', 
                border: 'none', 
                borderRadius: '0.375rem',
                background: chartDays === 30 ? 'var(--accent-violet)' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >30D</button>
          </div>
        </div>
        <div className="glass-card">
          <ActivityChart days={chartDays} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
