import React from 'react';
import { supabase } from '../lib/supabase';

const HabitCard = ({ habit, log, onToggle }) => {
  const isCompleted = log?.completed || false;

  const handleToggle = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newStatus = !isCompleted;

    try {
      // 1. Update/Insert habit log
      const { error: logError } = await supabase
        .from('habit_logs')
        .upsert({
          habit_id: habit.id,
          date: today,
          completed: newStatus
        }, { onConflict: 'habit_id, date' });

      if (logError) throw logError;

      // 2. Update streak on habit table
      let newStreak = habit.current_streak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (newStatus) {
        // Marking as completed
        if (habit.last_completed_date === yesterdayStr) {
          newStreak += 1;
        } else if (habit.last_completed_date !== today) {
          newStreak = 1;
        }
      } else {
        // Un-marking
        newStreak = Math.max(0, newStreak - 1);
      }

      const { error: habitError } = await supabase
        .from('habits')
        .update({
          current_streak: newStreak,
          last_completed_date: newStatus ? today : habit.last_completed_date
        })
        .eq('id', habit.id);

      if (habitError) throw habitError;

      onToggle(); // Refresh data
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Workout': return '💪';
      case 'Diet': return '🥗';
      case 'Recovery': return '🧘';
      default: return '✨';
    }
  };

  return (
    <div className={`glass-card animate-fade-in ${isCompleted ? 'completed' : ''}`} 
         style={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'space-between',
           marginBottom: '1rem',
           opacity: isCompleted ? 0.6 : 1,
           transition: 'var(--transition-fast)'
         }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '1.5rem' }}>{getIcon(habit.type)}</div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{habit.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-violet)', fontWeight: '600' }}>
              🔥 {habit.current_streak} day streak
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleToggle}
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: '2px solid',
          borderColor: isCompleted ? 'var(--accent-green)' : 'var(--glass-border)',
          backgroundColor: isCompleted ? 'var(--accent-green)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isCompleted ? 'white' : 'transparent',
          transition: 'var(--transition-fast)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default HabitCard;
