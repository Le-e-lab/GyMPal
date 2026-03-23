import React, { useId } from 'react';
import { Target } from 'lucide-react';

const BMIProgressRing = ({ weight }) => {
  const gradientId = useId();

  if (!weight) return null;

  // BMI calculation for 1.7m (5'7")
  const heightInMeters = 1.7;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  
  // Progress from 80kg (0%) to 70kg (100%)
  const startWeight = 80;
  const goalWeight = 70;
  
  let progress = 0;
  if (weight >= startWeight) progress = 0;
  else if (weight <= goalWeight) progress = 100;
  else progress = ((startWeight - weight) / (startWeight - goalWeight)) * 100;

  // Phase logic based on weight
  let phaseLabel = "The Foundation Phase";
  let phaseDesc = "Current focus";
  let colorClass = "text-red-500";
  let gradientClass = "from-red-600 to-orange-500";
  let dropShadowColor = "rgba(239, 68, 68, 0.4)";
  let stops = ["#ef4444", "#f97316"]; // Red to Orange
  
  if (weight <= 70) {
    phaseLabel = "The Mastery Phase";
    phaseDesc = "Final Shred achieved";
    colorClass = "text-emerald-500";
    gradientClass = "from-emerald-500 to-teal-400";
    dropShadowColor = "rgba(16, 185, 129, 0.4)";
    stops = ["#10b981", "#2dd4bf"]; // Emerald to Teal
  } else if (weight <= 75) {
    phaseLabel = "The Hypertrophy Phase";
    phaseDesc = "Seeing the 'Cuts'";
    colorClass = "text-orange-500";
    gradientClass = "from-orange-500 to-yellow-500";
    dropShadowColor = "rgba(249, 115, 22, 0.4)";
    stops = ["#f97316", "#eab308"]; // Orange to Yellow
  }

  const radius = 45;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const progressRounded = Math.round(progress);

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center mt-6 shadow-xl gap-4 sm:gap-0" role="status" aria-live="polite">
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
          role="img"
          aria-label={`Body composition progress ${progressRounded} percent complete toward 70 kilogram goal`}
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-zinc-800"
          />
          <circle
            stroke={`url(#${gradientId})`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset, 
              transition: 'stroke-dashoffset 1.5s ease-in-out',
              filter: `drop-shadow(0 0 6px ${dropShadowColor})` 
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={stops[0]} />
              <stop offset="100%" stopColor={stops[1]} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-white">{weight}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">KG</span>
        </div>
      </div>

      <div className="sm:ml-5 flex-1 w-full">
        <div className="flex items-center gap-2 mb-1">
          <Target size={16} className={colorClass} />
          <h3 className={`font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
            {phaseLabel}
          </h3>
        </div>
        <p className="text-sm text-zinc-400 mb-2">{phaseDesc}</p>
        <p className="text-xs text-zinc-500 mb-2">Progress: {progressRounded}% to 70kg target</p>
        <div className="flex items-center gap-3">
          <div className="bg-zinc-950 rounded-lg px-3 py-1.5 border border-zinc-800">
            <span className="text-xs text-zinc-500 block mb-0.5">BMI</span>
            <span className="text-sm font-bold text-zinc-300">{bmi}</span>
          </div>
          <div className="bg-zinc-950 rounded-lg px-3 py-1.5 border border-zinc-800">
            <span className="text-xs text-zinc-500 block mb-0.5">Goal</span>
            <span className="text-sm font-bold text-zinc-300">70</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMIProgressRing;
