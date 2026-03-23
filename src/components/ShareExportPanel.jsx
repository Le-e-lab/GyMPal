import React, { useEffect, useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';

const readFileAsText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
  reader.onerror = () => reject(new Error('Could not read file.'));
  reader.readAsText(file);
});

const encodePayload = (value) => {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const decodePayload = (value) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
};

const isValidWorkout = (workout) => {
  if (!workout || typeof workout !== 'object') return false;
  if (!Array.isArray(workout.routine) || workout.routine.length === 0) return false;
  return workout.routine.every((step) => typeof step === 'string' && step.trim().length > 0);
};

const ShareExportPanel = ({ currentWorkout, onApplyWorkout }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [shareUrlInput, setShareUrlInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const shareUrl = useMemo(() => {
    if (!currentWorkout) return '';

    try {
      const payload = encodePayload({
        type: 'gympal-workout',
        version: 1,
        workout: currentWorkout,
      });
      const url = new URL(window.location.href);
      url.searchParams.set('plan', payload);
      return url.toString();
    } catch {
      return '';
    }
  }, [currentWorkout]);

  const resetNotice = () => {
    setMessage('');
    setError('');
  };

  const exportJson = () => {
    resetNotice();

    if (!currentWorkout) {
      setError('No current workout to export.');
      return;
    }

    const payload = {
      type: 'gympal-workout',
      version: 1,
      exportedAt: new Date().toISOString(),
      workout: currentWorkout,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'gympal-workout-plan.json';
    anchor.click();
    URL.revokeObjectURL(objectUrl);

    setMessage('Workout exported as JSON.');
  };

  const importPayload = (payload) => {
    const workout = payload?.workout || payload;
    if (!isValidWorkout(workout)) {
      throw new Error('Imported content is missing a valid workout routine.');
    }
    onApplyWorkout(workout);
  };

  const importFromJsonInput = () => {
    resetNotice();

    try {
      const parsed = JSON.parse(jsonInput);
      importPayload(parsed);
      setMessage('Workout imported from JSON.');
    } catch (err) {
      setError(err.message || 'Could not import JSON.');
    }
  };

  const importFromShareUrl = () => {
    resetNotice();

    try {
      const target = new URL(shareUrlInput.trim());
      const encoded = target.searchParams.get('plan');
      if (!encoded) {
        throw new Error('The provided URL has no shared plan payload.');
      }
      const parsed = decodePayload(encoded);
      importPayload(parsed);
      setMessage('Workout imported from shared URL.');
    } catch (err) {
      setError(err.message || 'Could not import shared URL.');
    }
  };

  const importFromFile = async (event) => {
    resetNotice();

    try {
      const file = event.target.files?.[0];
      if (!file) return;
      const text = await readFileAsText(file);
      const parsed = JSON.parse(text);
      importPayload(parsed);
      setMessage('Workout imported from file.');
    } catch (err) {
      setError(err.message || 'Could not import file.');
    } finally {
      event.target.value = '';
    }
  };

  const copyShareUrl = async () => {
    resetNotice();

    if (!shareUrl) {
      setError('No share URL available. Generate or select a workout first.');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage('Share URL copied to clipboard.');
    } catch {
      setError('Could not copy URL.');
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('plan');
    if (!encoded) return;

    try {
      const parsed = decodePayload(encoded);
      if (isValidWorkout(parsed?.workout || parsed)) {
        setMessage('Shared plan detected in URL. Paste the link into Import URL if you want to load it manually.');
      }
    } catch {
      // Ignore malformed URL payloads.
    }
  }, []);

  return (
    <section className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800" aria-label="Share and export workout plans">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Share2 size={18} className="text-cyan-400" />
        Share, Export, Import
      </h3>
      <p className="text-xs text-zinc-400 mt-1">
        Priority 7. Export current plan, share a URL, or import workouts from teammates.
      </p>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={exportJson}
          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 font-bold text-black transition-colors"
        >
          Export Current Workout JSON
        </button>
        <button
          type="button"
          onClick={copyShareUrl}
          className="rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 font-bold text-white border border-zinc-600 transition-colors"
        >
          Copy Share URL
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <textarea
          value={jsonInput}
          onChange={(event) => setJsonInput(event.target.value)}
          className="w-full min-h-[140px] rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white"
          placeholder="Paste workout JSON payload here"
          aria-label="Workout JSON input"
        />
        <button
          type="button"
          onClick={importFromJsonInput}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-bold text-black transition-colors"
        >
          Import From JSON
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <input
          type="url"
          value={shareUrlInput}
          onChange={(event) => setShareUrlInput(event.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white"
          placeholder="Paste shared GymPal URL"
          aria-label="Shared workout URL"
        />
        <button
          type="button"
          onClick={importFromShareUrl}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 font-bold text-white transition-colors"
        >
          Import From URL
        </button>
      </div>

      <label className="mt-4 block text-sm text-zinc-300">
        Import from JSON file
        <input
          type="file"
          accept="application/json"
          onChange={importFromFile}
          className="mt-2 block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-200 file:px-3 file:py-2"
        />
      </label>

      {shareUrl && (
        <p className="mt-3 text-xs text-zinc-500 break-all">
          Live share URL: {shareUrl}
        </p>
      )}

      {message && (
        <p className="mt-3 text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-3 py-2">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-300 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </section>
  );
};

export default ShareExportPanel;
