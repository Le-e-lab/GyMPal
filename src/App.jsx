import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { requestNotificationPermission, scheduleWorkoutReminder } from './hooks/useNotifications';

function App() {
  useEffect(() => {
    // Attempt to request notification permission on mount
    requestNotificationPermission().then(granted => {
      if (granted) {
        // Schedule reminder for 18:00 today
        scheduleWorkoutReminder('18:00', 'GyMPal Mission time!', 'Your daily calisthenics & skipping routine awaits.');
      }
    });

    // Handle PWA SW registration info/updates (Optional deep integration)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' });
      });
    }
  }, []);

  return (
    <Router>
      <div className="bg-black min-h-screen text-zinc-100 font-sans antialiased selection:bg-emerald-500/30">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
