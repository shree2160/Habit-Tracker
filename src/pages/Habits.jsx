import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Habits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', type: 'Workout' });

  const fetchHabits = async () => {
    const { data } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });
    setHabits(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('habits')
        .insert([{ ...newHabit, user_id: user.id }]);
      
      if (error) throw error;
      
      setNewHabit({ name: '', type: 'Workout' });
      setShowAddModal(false);
      fetchHabits();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteHabit = async (id) => {
    if (!confirm('Are you sure you want to delete this habit? All history will be lost.')) return;
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchHabits();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="container"><p>Loading habits...</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Habits</h1>
        <button 
          className="btn btn-primary" 
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
          onClick={() => setShowAddModal(true)}
        >
          + Add
        </button>
      </div>

      <div className="habit-list">
        {habits.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No habits found. Add your first one above!</p>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="glass-card animate-fade-in" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{habit.name}</h3>
                <p style={{ fontSize: '0.8rem' }}>Type: {habit.type}</p>
              </div>
              <button 
                onClick={() => handleDeleteHabit(habit.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))
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
            <h2>New Habit</h2>
            <form onSubmit={handleAddHabit}>
              <div className="input-group">
                <label>Habit Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Morning Run" 
                  value={newHabit.name}
                  onChange={e => setNewHabit({...newHabit, name: e.target.value})}
                  required
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label>Type</label>
                <select 
                  style={{
                    width: '100%', padding: '0.875rem 1rem', background: 'var(--bg-card)', 
                    border: '1px solid var(--glass-border)', borderRadius: '0.75rem', 
                    color: 'white', outline: 'none', appearance: 'none'
                  }}
                  value={newHabit.type}
                  onChange={e => setNewHabit({...newHabit, type: e.target.value})}
                >
                  <option value="Workout" style={{ background: '#1E293B', color: 'white' }}>Workout</option>
                  <option value="Diet" style={{ background: '#1E293B', color: 'white' }}>Diet</option>
                  <option value="Recovery" style={{ background: '#1E293B', color: 'white' }}>Recovery</option>
                </select>
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

export default Habits;
