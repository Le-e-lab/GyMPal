import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const toDateKey = (date) => {
  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return normalized.toISOString().split('T')[0];
};

const formatDateLabel = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const ProgressOverview = ({ history = [], jogLogs = [] }) => {
  const chartData = useMemo(() => {
    const days = 14;
    const workouts = new Set(history);
    const jogMap = new Map(jogLogs.map((log) => [log.date, log.distanceKm]));
    const list = [];

    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - offset);
      const key = toDateKey(day);

      list.push({
        key,
        label: formatDateLabel(day),
        workouts: workouts.has(key) ? 1 : 0,
        jogKm: Number.isFinite(jogMap.get(key)) ? jogMap.get(key) : 0,
      });
    }

    return list;
  }, [history, jogLogs]);

  const summary = useMemo(() => {
    const completedSessions = chartData.reduce((acc, item) => acc + item.workouts, 0);
    const totalJogKm = chartData.reduce((acc, item) => acc + item.jogKm, 0);

    return {
      completedSessions,
      totalJogKm: Math.round(totalJogKm * 10) / 10,
    };
  }, [chartData]);

  return (
    <section className="mb-10 p-6 rounded-2xl bg-zinc-900 border border-zinc-800" aria-label="Progress analytics overview">
      <h3 className="text-lg font-bold text-white">14-Day Analytics</h3>
      <p className="text-xs text-zinc-400 mt-1">Session consistency and running volume trend.</p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Sessions</p>
          <p className="text-2xl text-white font-extrabold mt-1">{summary.completedSessions}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Jog Volume</p>
          <p className="text-2xl text-white font-extrabold mt-1">{summary.totalJogKm} km</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Workout Completion</p>
        <div className="h-40 w-full" role="img" aria-label="Workout completion bars over the last fourteen days">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="label" stroke="#71717a" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis domain={[0, 1]} ticks={[0, 1]} stroke="#71717a" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => (value ? 'Completed' : 'Missed')}
                labelFormatter={(value) => `Date: ${value}`}
                contentStyle={{ background: '#09090b', border: '1px solid #3f3f46', borderRadius: '0.75rem' }}
              />
              <Bar dataKey="workouts" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Jog Distance (km)</p>
        <div className="h-44 w-full" role="img" aria-label="Jog distance line chart over the last fourteen days">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="label" stroke="#71717a" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis stroke="#71717a" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => `${value} km`}
                labelFormatter={(value) => `Date: ${value}`}
                contentStyle={{ background: '#09090b', border: '1px solid #3f3f46', borderRadius: '0.75rem' }}
              />
              <Line type="monotone" dataKey="jogKm" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, fill: '#f59e0b' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default ProgressOverview;
