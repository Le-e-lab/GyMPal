import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import {
  PWA_EVENTS,
  PWA_GLOBALS,
  PWA_INSTALL_PROMPT,
  PWA_STORAGE_KEYS,
  PWA_TOAST_TIMEOUTS_MS,
} from './constants/pwa';
import { requestNotificationPermission, scheduleWorkoutReminder } from './hooks/useNotifications';

const shouldShowIosInstallHint = () => {
  const dismissedAtRaw = localStorage.getItem(PWA_STORAGE_KEYS.installPromptDismissedAt);
  const dismissedAt = dismissedAtRaw ? Number.parseInt(dismissedAtRaw, 10) : 0;
  const isDismissedCoolingDown = Number.isFinite(dismissedAt)
    && Date.now() - dismissedAt < PWA_INSTALL_PROMPT.dismissCooldownMs;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  return !isStandalone && isIos && !isDismissedCoolingDown;
};

function App() {
  const routerBase = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');
  const [isPwaUpdateReady, setIsPwaUpdateReady] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showIosInstallHint, setShowIosInstallHint] = useState(() => shouldShowIosInstallHint());

  const markInstallPromptDismissed = () => {
    localStorage.setItem(PWA_STORAGE_KEYS.installPromptDismissedAt, String(Date.now()));
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    setShowIosInstallHint(false);
    markInstallPromptDismissed();
  };

  const applyPwaUpdate = () => {
    const applyUpdate = window[PWA_GLOBALS.applyUpdate];

    if (typeof applyUpdate === 'function') {
      applyUpdate();
      return;
    }

    window.location.reload();
  };

  const triggerInstallPrompt = async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;

    setShowInstallPrompt(false);
    setDeferredInstallPrompt(null);

    if (choice.outcome !== 'accepted') {
      markInstallPromptDismissed();
    }
  };

  useEffect(() => {
    // Attempt to request notification permission on mount
    requestNotificationPermission().then(granted => {
      if (granted) {
        // Schedule reminder for 18:00 today
        scheduleWorkoutReminder('18:00', 'GyMPal Mission time!', 'Your daily calisthenics & skipping routine awaits.');
      }
    });
  }, []);

  useEffect(() => {
    const handleUpdateReady = () => {
      setIsPwaUpdateReady(true);
    };

    const handleOfflineReady = () => {
      setIsOfflineReady(true);
    };

    window.addEventListener(PWA_EVENTS.updateReady, handleUpdateReady);
    window.addEventListener(PWA_EVENTS.offlineReady, handleOfflineReady);

    return () => {
      window.removeEventListener(PWA_EVENTS.updateReady, handleUpdateReady);
      window.removeEventListener(PWA_EVENTS.offlineReady, handleOfflineReady);
    };
  }, []);

  useEffect(() => {
    const dismissedAtRaw = localStorage.getItem(PWA_STORAGE_KEYS.installPromptDismissedAt);
    const dismissedAt = dismissedAtRaw ? Number.parseInt(dismissedAtRaw, 10) : 0;
    const isDismissedCoolingDown = Number.isFinite(dismissedAt)
      && Date.now() - dismissedAt < PWA_INSTALL_PROMPT.dismissCooldownMs;

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
      if (!isDismissedCoolingDown) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setShowIosInstallHint(false);
      setDeferredInstallPrompt(null);
      localStorage.removeItem(PWA_STORAGE_KEYS.installPromptDismissedAt);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isPwaUpdateReady) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsPwaUpdateReady(false);
    }, PWA_TOAST_TIMEOUTS_MS.updateReady);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isPwaUpdateReady]);

  useEffect(() => {
    if (!isOfflineReady) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsOfflineReady(false);
    }, PWA_TOAST_TIMEOUTS_MS.offlineReady);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOfflineReady]);

  return (
    <Router basename={routerBase}>
      <div className="bg-black min-h-screen text-zinc-100 font-sans antialiased selection:bg-emerald-500/30">
        {(isPwaUpdateReady || isOfflineReady || showInstallPrompt || showIosInstallHint) && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-md flex flex-col gap-2">
            {showInstallPrompt && deferredInstallPrompt && (
              <div className="rounded-2xl border border-cyan-500/40 bg-zinc-950/95 backdrop-blur p-3 sm:p-4 shadow-2xl" role="status" aria-live="polite">
                <p className="text-sm text-zinc-200">Install GyMPal for faster launch and full-screen workouts.</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={triggerInstallPrompt}
                    className="flex-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm py-2 transition-colors"
                  >
                    Install App
                  </button>
                  <button
                    type="button"
                    onClick={dismissInstallPrompt}
                    className="rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm px-3 py-2 transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            )}

            {showIosInstallHint && !showInstallPrompt && (
              <div className="rounded-2xl border border-cyan-500/40 bg-zinc-950/95 backdrop-blur p-3 sm:p-4 shadow-2xl" role="status" aria-live="polite">
                <p className="text-sm text-zinc-200">On iPhone: tap Share, then Add to Home Screen to install GyMPal.</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={dismissInstallPrompt}
                    className="rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm px-3 py-2 transition-colors"
                  >
                    Hide
                  </button>
                </div>
              </div>
            )}

            {isPwaUpdateReady && (
              <div className="rounded-2xl border border-emerald-600/40 bg-zinc-950/95 backdrop-blur p-3 sm:p-4 shadow-2xl" role="status" aria-live="polite">
                <p className="text-sm text-zinc-200">A new version of GyMPal is ready.</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={applyPwaUpdate}
                    className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-sm py-2 transition-colors"
                  >
                    Update Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPwaUpdateReady(false)}
                    className="rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm px-3 py-2 transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            )}

            {isOfflineReady && (
              <div className="rounded-2xl border border-blue-600/40 bg-zinc-950/95 backdrop-blur p-3 sm:p-4 shadow-2xl" role="status" aria-live="polite">
                <p className="text-sm text-zinc-200">GyMPal is now ready for offline use.</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOfflineReady(false)}
                    className="rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm px-3 py-2 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
