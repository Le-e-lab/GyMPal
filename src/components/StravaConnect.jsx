import React, { useState } from 'react';
import {
  getStravaAuthUrl,
  isStravaConnected,
  clearTokens,
  getAthleteName,
} from '../utils/stravaClient';

const StravaConnect = ({ onConnected, onDisconnected }) => {
  const [connected, setConnected] = useState(() => isStravaConnected());
  const [disconnecting, setDisconnecting] = useState(false);

  const handleConnect = () => {
    // Open Strava auth in a popup window
    const authUrl = getStravaAuthUrl();
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'strava-auth',
      `width=${width},height=${height},left=${left},top=${top},popup=1`
    );

    // Poll the popup to detect when it closes after auth
    const pollTimer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollTimer);
        // Check if we have tokens now
        if (isStravaConnected()) {
          setConnected(true);
          onConnected?.();
        }
      }
    }, 500);
  };

  const handleDisconnect = () => {
    setDisconnecting(true);
    clearTokens();
    setConnected(false);
    setDisconnecting(false);
    onDisconnected?.();
  };

  const athleteName = getAthleteName();

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Strava logo — simple inline SVG */}
          <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.387 17.944L11.94 24H8.369l4.321-8.314" fill="#FC4C02" />
            <path d="M11.94 10.99L8.369 17.235H4.799l5.628-10.82 1.513-2.913 1.513 2.913 5.628 10.82h-3.57L11.94 10.99z" fill="#FC4C02" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-white">Strava</h4>
            <p className="text-xs text-zinc-400">
              {connected
                ? athleteName
                  ? `Connected as ${athleteName}`
                  : 'Connected'
                : 'Sync your runs and activities'}
            </p>
          </div>
        </div>

        {connected ? (
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="shrink-0 px-4 py-2 rounded-full border border-orange-500/30 text-orange-400 text-xs font-semibold hover:bg-orange-500/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {disconnecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            className="shrink-0 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold transition-all active:scale-95 shadow-lg shadow-orange-500/20"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default StravaConnect;
