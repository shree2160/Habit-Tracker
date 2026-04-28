import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1>My Profile</h1>
        <p>Manage your account and settings.</p>
      </header>

      <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '4rem', height: '4rem', borderRadius: '50%', 
            background: 'var(--accent-violet)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700' 
          }}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{user?.email?.split('@')[0]}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>ACCOUNT ID</p>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', wordBreak: 'break-all' }}>{user?.id}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>MEMBER SINCE</p>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {new Date(user?.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <button className="btn btn-outline" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }} onClick={signOut}>
        Sign Out
      </button>

      <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontSize: '0.75rem' }}>Athlete Habit Tracker v1.0.0</p>
      </div>
    </div>
  );
};

export default Profile;
