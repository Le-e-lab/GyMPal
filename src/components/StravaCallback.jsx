import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCode } from '../utils/stravaClient';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Strava OAuth callback page.
 * Strava redirects here with an authorization code after the user approves access.
 * This component exchanges the code for tokens and redirects back to the dashboard.
 */
const StravaCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('exchanging'); // 'exchanging' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setErrorMsg('Authorization was denied.');
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMsg('No authorization code received.');
      return;
    }

    // Exchange the code for tokens via our serverless function
    exchangeCode(code)
      .then(() => {
        setStatus('success');
        // Redirect back to dashboard after a brief pause
        setTimeout(() => navigate('/'), 1500);
      })
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message || 'Failed to connect Strava. Please try again.');
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        {status === 'exchanging' && (
          <div>
            <Activity size={40} className="mx-auto text-orange-400 animate-pulse mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Connecting Strava...</h2>
            <p className="text-sm text-zinc-400">Securely linking your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Connected!</h2>
            <p className="text-sm text-zinc-400">Redirecting back to GyMPal...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle size={40} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Connection Failed</h2>
            <p className="text-sm text-zinc-400 mb-6">{errorMsg}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StravaCallback;
