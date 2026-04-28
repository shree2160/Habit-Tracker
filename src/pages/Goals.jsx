import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Goals = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    habit_id: '', 
    target_count: 30, 
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const fetchData = async () => {
    // Fetch habits for the dropdown
    const { data: habitsData } = await supabase
      .from('habits')
      .select('id, name');
    setHabits(habitsData || []);

    // Fetch goals
    const { data: goalsData } = await supabase
      .from('goals')
      .select(`
        *,
        habits (name)
      `);

    // For each goal, count the habit logs in range
    const goalsWithProgress = await Promise.all((goalsData || []).map(async (goal) => {
      const { count } = await supabase
        .from('habit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('habit_id', goal.habit_id)
        .eq('completed', true)
        .gte('date', goal.start_date)
        .lte('date', goal.end_date);
      
      return { ...goal, current_count: count || 0 };
    }));

    setGoals(goalsWithProgress);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.habit_id) return alert('Please select a habit');

    try {
      const { error } = await supabase
        .from('goals')
        .insert([{ ...newGoal, user_id: user.id }]);
      
      if (error) throw error;
      
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="container"><p>Loading goals...</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Goals</h1>
        <button 
          className="btn btn-primary" 
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
          onClick={() => setShowAddModal(true)}
        >
          + New Goal
        </button>
      </div>

      <div className="goal-list">
        {goals.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No goals yet. Link a goal to a habit to track long-term progress!</p>
        ) : (
          goals.map(goal => {
            const progress = Math.min(100, Math.round((goal.current_count / goal.target_count) * 100));
            return (
              <div key={goal.id} className="glass-card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-violet)' }}>{goal.title}</h3>
                    <p style={{ fontSize: '0.875rem' }}>Focus: {goal.habits?.name}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{goal.current_count} / {goal.target_count}</div>
                    <p style={{ fontSize: '0.75rem' }}>until {new Date(goal.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${progress}%`, height: '100%', 
                    background: progress === 100 ? 'var(--accent-green)' : 'var(--accent-violet)', 
                    transition: 'width 0.5s ease' 
                  }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-dark)' }}>
            <h2>New Goal</h2>
            <form onSubmit={handleAddGoal}>
              <div className="input-group">
                <label>Goal Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., 20 Morning Runs" 
                  value={newGoal.title}
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Linked Habit</label>
                <select 
                  style={{
                    width: '100%', padding: '0.875rem 1rem', background: 'var(--bg-card)', 
                    border: '1px solid var(--glass-border)', borderRadius: '0.75rem', 
                    color: 'white', outline: 'none', appearance: 'none'
                  }}
                  value={newGoal.habit_id}
                  onChange={e => setNewGoal({...newGoal, habit_id: e.target.value})}
                  required
                >
                  <option value="" style={{ background: '#1E293B', color: 'white' }}>Select a habit...</option>
                  {habits.map(h => <option key={h.id} value={h.id} style={{ background: '#1E293B', color: 'white' }}>{h.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Target Count</label>
                <input 
                  type="number" 
                  value={newGoal.target_count}
                  onChange={e => setNewGoal({...newGoal, target_count: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Target Date (Deadline)</label>
                <input 
                  type="date" 
                  value={newGoal.end_date}
                  onChange={e => setNewGoal({...newGoal, end_date: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
