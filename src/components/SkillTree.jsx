import React, { useState, useEffect } from 'react';
import { getAllSkillBranches, loadSkills, calculateSkillProgress } from '../hooks/useSkills';
import { Trophy, Target, Flame, Star, Zap, Award, ChevronRight, Crown, Sparkles } from 'lucide-react';
import './SkillTree.css';

/* ── Mastery Tiers ── */
const MASTERY_TIERS = [
  { min: 1,  max: 3,  title: 'Novice',     icon: '🌱', color: '#a1a1aa' },
  { min: 4,  max: 7,  title: 'Apprentice', icon: '🔥', color: '#f59e0b' },
  { min: 8,  max: 11, title: 'Adept',      icon: '⚔️', color: '#10b981' },
  { min: 12, max: 15, title: 'Expert',     icon: '💎', color: '#06b6d4' },
  { min: 16, max: 19, title: 'Master',     icon: '👑', color: '#8b5cf6' },
  { min: 20, max: 99, title: 'Grandmaster', icon: '🌟', color: '#f59e0b' },
];

const getMasteryTier = (level) =>
  MASTERY_TIERS.find((t) => level >= t.min && level <= t.max) || MASTERY_TIERS[0];

/* ── Skill-specific unlockable content ── */
const SKILL_UNLOCKS = {
  pullingStrength: [
    { level: 1,  label: 'Bodyweight Pulls' },
    { level: 3,  label: 'Pull-up Progression' },
    { level: 5,  label: 'Weighted Pull-ups' },
    { level: 8,  label: 'Advanced Rows' },
    { level: 12, label: 'Muscle-up Training' },
    { level: 16, label: 'One-arm Pull-up Prep' },
    { level: 20, label: 'Elite Back Strength' },
  ],
  pushingPower: [
    { level: 1,  label: 'Basic Push-ups' },
    { level: 3,  label: 'Decline / Incline Variations' },
    { level: 5,  label: 'Weighted Push-ups' },
    { level: 8,  label: 'Plyometric Push-ups' },
    { level: 12, label: 'Handstand Push-up Prep' },
    { level: 16, label: 'Planche Progression' },
    { level: 20, label: 'Elite Press Strength' },
  ],
  legStrength: [
    { level: 1,  label: 'Bodyweight Squats' },
    { level: 3,  label: 'Lunges & Step-ups' },
    { level: 5,  label: 'Weighted Squats' },
    { level: 8,  label: 'Pistol Squat Prep' },
    { level: 12, label: 'Jump Squats & Explosive Legs' },
    { level: 16, label: 'Heavy Compound Lifts' },
    { level: 20, label: 'Elite Lower Body Power' },
  ],
  coreStability: [
    { level: 1,  label: 'Basic Planks' },
    { level: 3,  label: 'Side Planks & Rotations' },
    { level: 5,  label: 'Weighted Core Work' },
    { level: 8,  label: 'Dragon Flag Prep' },
    { level: 12, label: 'Advanced Calisthenics Core' },
    { level: 16, label: 'Full Centre Control' },
    { level: 20, label: 'Elite Core Stability' },
  ],
  explosivePower: [
    { level: 1,  label: 'Basic Jumps' },
    { level: 3,  label: 'Box Jumps & Bounds' },
    { level: 5,  label: 'Plyometric Circuit' },
    { level: 8,  label: 'Explosive Push / Pull' },
    { level: 12, label: 'Olympic Lift Prep' },
    { level: 16, label: 'High-output Power Training' },
    { level: 20, label: 'Elite Explosiveness' },
  ],
  cardio: [
    { level: 1,  label: 'Walking / Light Jog' },
    { level: 3,  label: 'Steady-state Running' },
    { level: 5,  label: 'HIIT Intervals' },
    { level: 8,  label: 'Long-endurance Base' },
    { level: 12, label: 'Tempo & Threshold Runs' },
    { level: 16, label: 'Advanced Conditioning' },
    { level: 20, label: 'Elite Cardiovascular Engine' },
  ],
  gripStrength: [
    { level: 1,  label: 'Dead Hangs' },
    { level: 3,  label: 'Farmer Carries' },
    { level: 5,  label: 'Pinch Grip Work' },
    { level: 8,  label: 'Towel Pull-ups' },
    { level: 12, label: 'One-arm Hang Prep' },
    { level: 16, label: 'Crush Grip Training' },
    { level: 20, label: 'Elite Grip Power' },
  ],
  shoulderStability: [
    { level: 1,  label: 'Arm Circles & Stretches' },
    { level: 3,  label: 'Scapular Retraction' },
    { level: 5,  label: 'External Rotation Work' },
    { level: 8,  label: 'Handstand Prep' },
    { level: 12, label: 'Advanced Mobility' },
    { level: 16, label: 'Full ROM Control' },
    { level: 20, label: 'Elite Shoulder Integrity' },
  ],
  discipline: [
    { level: 1,  label: 'Daily Habits Unlocked' },
    { level: 3,  label: 'Habit Streak Bonuses' },
    { level: 5,  label: 'All-habit Completion Reward' },
    { level: 8,  label: 'Custom Habit Slots' },
    { level: 12, label: 'Double XP for 7-day Streaks' },
    { level: 16, label: 'Triple XP for 30-day Streaks' },
    { level: 20, label: 'Master of Consistency' },
  ],
};

const getUnlocksForSkill = (skillKey, currentLevel) => {
  const unlocks = SKILL_UNLOCKS[skillKey] || [];
  return {
    unlocked: unlocks.filter((u) => u.level <= currentLevel),
    upcoming: unlocks.filter((u) => u.level > currentLevel).slice(0, 3),
  };
};

/* ── Motivation messages ── */
const MOTIVATION = [
  'Every rep compounds into greatness.',
  'Consistency is the ultimate skill.',
  'Small daily wins → massive long-term gains.',
  'The grind never stops — and neither do you.',
  'Level up your body, level up your mind.',
  'Your future self is watching. Make them proud.',
];

const getMotivation = () => MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];

/* ── Radial Progress Component ── */
const RadialProgress = ({ percent, size = 48, strokeWidth = 4, color = '#10b981' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="radial-progress-svg" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="radial-progress-circle"
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="10" fontWeight="700">
        {Math.round(percent)}%
      </text>
    </svg>
  );
};

/* ── Main Component ── */
const SkillTree = () => {
  const [skills, setSkills] = useState(() => loadSkills());
  const [activeTab, setActiveTab] = useState('overview');
  const [celebration, setCelebration] = useState(null);

  const skillBranches = getAllSkillBranches();

  const getSkillData = (skillKey) => {
    const skillData = skills[skillKey] || { xp: 0 };
    return { ...calculateSkillProgress(skillData.xp), xp: skillData.xp };
  };

  // Compute totals
  const allSkillData = Object.keys(skillBranches).map((k) => ({ key: k, ...getSkillData(k) }));
  const totalXP = allSkillData.reduce((s, d) => s + d.xp, 0);
  const avgLevel = allSkillData.reduce((s, d) => s + d.level, 0) / allSkillData.length || 0;
  const bestSkill = allSkillData.reduce((best, d) => (d.level > (best?.level || 0) ? d : best), null);
  const highestLevel = Math.max(...allSkillData.map((d) => d.level), 0);

  const handleSkillClick = (skillKey) => {
    setActiveTab(skillKey);
    const data = getSkillData(skillKey);
    // Show celebration for milestone levels
    if (data.level > 0 && data.level % 5 === 0) {
      setCelebration(skillKey);
      setTimeout(() => setCelebration(null), 3000);
    }
  };

  return (
    <div className="skill-tree-container">
      {/* Header */}
      <div className="skill-tree-header">
        <h2 className="flex items-center justify-center gap-3">
          <Trophy size={28} className="text-emerald-400" />
          <span>Skill Progression</span>
        </h2>
        <p>Track your growth across all attributes</p>
      </div>

      {/* Top-level progress summary */}
      <div className="skill-summary-banner">
        <div className="summary-stat">
          <span className="summary-value">{totalXP.toLocaleString()}</span>
          <span className="summary-label">Total XP</span>
        </div>
        <div className="summary-stat">
          <span className="summary-value">{avgLevel.toFixed(1)}</span>
          <span className="summary-label">Avg Level</span>
        </div>
        <div className="summary-stat">
          <span className="summary-value">{highestLevel}</span>
          <span className="summary-label">Peak Level</span>
        </div>
        {bestSkill && (
          <div className="summary-stat">
            <span className="summary-value skill-best-label">
              {skillBranches[bestSkill.key]?.icon} {skillBranches[bestSkill.key]?.name}
            </span>
            <span className="summary-label">Best Skill</span>
          </div>
        )}
      </div>

      {/* Skill Tab Grid */}
      <div className="skill-tree-tabs">
        {Object.keys(skillBranches).map((skillKey) => {
          const branch = skillBranches[skillKey];
          const data = getSkillData(skillKey);
          const tier = getMasteryTier(data.level || 1);
          return (
            <button
              key={skillKey}
              className={`skill-tab ${activeTab === skillKey ? 'active' : ''}`}
              onClick={() => handleSkillClick(skillKey)}
              style={{ '--accent': branch.color }}
            >
              {/* Radial progress indicator */}
              <div className="skill-tab-radial">
                <RadialProgress percent={data.progressPercent} size={52} strokeWidth={4} color={branch.color} />
                <span className="skill-tab-badge-icon">{branch.icon}</span>
              </div>
              <div className="skill-tab-info">
                <div className="skill-tab-name">{branch.name}</div>
                <div className="skill-tab-level">
                  Lv.{data.level} · <span style={{ color: tier.color }}>{tier.title}</span>
                </div>
              </div>
              <ChevronRight size={16} className="skill-tab-arrow" />
            </button>
          );
        })}
      </div>

      {/* === OVERVIEW PANEL === */}
      {activeTab === 'overview' ? (
        <div className="skill-panel">
          <div className="panel-header">
            <h3>
              <Award size={20} className="text-emerald-400" />
              Full Roster
            </h3>
            <p>Click any skill above to see details, unlockables, and training tips.</p>
          </div>

          <div className="skill-stats">
            {Object.keys(skillBranches).map((skillKey) => {
              const branch = skillBranches[skillKey];
              const data = getSkillData(skillKey);
              const tier = getMasteryTier(data.level || 1);
              return (
                <div
                  key={skillKey}
                  className="skill-stat-card"
                  onClick={() => handleSkillClick(skillKey)}
                  style={{ cursor: 'pointer', '--stat-accent': branch.color }}
                >
                  <div className="stat-card-header">
                    <span className="stat-card-icon">{branch.icon}</span>
                    <RadialProgress percent={data.progressPercent} size={40} strokeWidth={3} color={branch.color} />
                  </div>
                  <h4>{branch.name}</h4>
                  <div className="stat-meta">
                    <span className="stat-level">Level {data.level}</span>
                    <span className="stat-tier" style={{ color: tier.color }}>· {tier.title}</span>
                  </div>
                  <div className="stat-xp-bar">
                    <div
                      className="stat-xp-fill"
                      style={{ width: `${data.progressPercent}%`, background: `linear-gradient(90deg, ${branch.color}88, ${branch.color})` }}
                    />
                  </div>
                  <div className="stat-xp-text">
                    {data.xp.toLocaleString()} XP · {Math.round(data.progressPercent)}% to Lv.{data.level + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* === DETAIL PANEL === */
        <div className={`skill-panel ${celebration === activeTab ? 'panel-celebrating' : ''}`}>
          {/* Celebration overlay */}
          {celebration === activeTab && (
            <div className="celebration-flash">
              <Sparkles size={32} className="celebration-icon" />
              <span>Milestone Level!</span>
            </div>
          )}

          <div className="panel-header">
            <h3>
              <span>{skillBranches[activeTab].icon}</span>
              <span>{skillBranches[activeTab].name}</span>
            </h3>
            <p>{skillBranches[activeTab].description}</p>
          </div>

          {/* Hero progress card */}
          {(() => {
            const data = getSkillData(activeTab);
            const tier = getMasteryTier(data.level || 1);
            return (
              <div className="skill-hero" style={{ '--hero-accent': skillBranches[activeTab].color }}>
                <div className="hero-left">
                  <div className="hero-level-ring">
                    <RadialProgress percent={data.progressPercent} size={96} strokeWidth={6} color={skillBranches[activeTab].color} />
                    <span className="hero-level-icon">{skillBranches[activeTab].icon}</span>
                  </div>
                </div>
                <div className="hero-right">
                  <div className="hero-level-display">
                    <span className="hero-level-number" style={{ color: skillBranches[activeTab].color }}>Level {data.level}</span>
                    <span className="hero-tier-badge" style={{ background: `${tier.color}22`, color: tier.color, borderColor: `${tier.color}44` }}>
                      {tier.icon} {tier.title}
                    </span>
                  </div>
                  <div className="hero-xp-bar">
                    <div
                      className="hero-xp-fill"
                      style={{ width: `${data.progressPercent}%`, background: `linear-gradient(90deg, ${skillBranches[activeTab].color}66, ${skillBranches[activeTab].color})` }}
                    />
                  </div>
                  <div className="hero-xp-detail">
                    <span>{data.xp.toLocaleString()} Total XP</span>
                    <span>{data.xpInLevel.toLocaleString()} / {data.xpForNextLevel.toLocaleString()} to next level</span>
                  </div>
                  <div className="hero-motivation">{getMotivation()}</div>
                </div>
              </div>
            );
          })()}

          {/* Upcoming Unlockables */}
          <div className="skill-section">
            <h4>
              <Star size={16} className="text-amber-400" />
              Unlockables &amp; Milestones
            </h4>
            {(() => {
              const data = getSkillData(activeTab);
              const { unlocked, upcoming } = getUnlocksForSkill(activeTab, data.level);
              return (
                <div className="unlock-timeline">
                  {unlocked.map((u, i) => (
                    <div key={i} className="unlock-item unlocked">
                      <div className="unlock-marker unlocked-marker" />
                      <span className="unlock-level">Lv.{u.level}</span>
                      <span className="unlock-label">{u.label}</span>
                      <Award size={14} className="unlock-check" />
                    </div>
                  ))}
                  {upcoming.map((u, i) => (
                    <div key={i} className="unlock-item upcoming">
                      <div className="unlock-marker upcoming-marker" />
                      <span className="unlock-level">Lv.{u.level}</span>
                      <span className="unlock-label">{u.label}</span>
                      <Lock size={12} className="unlock-lock" />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Training Tips */}
          <div className="skill-section">
            <h4>
              <Zap size={16} className="text-amber-400" />
              {activeTab === 'discipline' ? 'Discipline Tips' : 'Training Tips'}
            </h4>
            <div className="tips-grid">
              {activeTab === 'discipline'
                ? [
                    'Complete all daily habits to maximize Discipline XP gains.',
                    'Consistency beats intensity — every completed habit earns XP.',
                    'Long streaks unlock bonus Discipline XP multipliers.',
                    'Balance health and work habits for well-rounded growth.',
                  ].map((tip, i) => (
                    <div key={i} className="tip-card">
                      <Sparkles size={14} className="tip-icon" />
                      <span>{tip}</span>
                    </div>
                  ))
                : [
                    'Focus on controlled movements and proper form to maximize skill gains.',
                    'Progressive overload is the key to unlocking higher levels.',
                    'Rest and recovery are essential — skills grow during rest, not during workouts.',
                    'Track every session to see your XP compound over time.',
                  ].map((tip, i) => (
                    <div key={i} className="tip-card">
                      <Sparkles size={14} className="tip-icon" />
                      <span>{tip}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* All Mastery Tiers reference */}
          <div className="skill-section">
            <h4>
              <Crown size={16} className="text-amber-400" />
              Mastery Roadmap
            </h4>
            <div className="tiers-grid">
              {MASTERY_TIERS.map((tier) => (
                <div
                  key={tier.title}
                  className={`tier-pill ${getMasteryTier(getSkillData(activeTab).level || 1).title === tier.title ? 'current' : ''}`}
                  style={{ '--tier-color': tier.color }}
                >
                  <span>{tier.icon}</span>
                  <span>{tier.title}</span>
                  <span className="tier-range">Lv.{tier.min}–{tier.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Inline Lock icon (avoid importing another lucide icon) */
const Lock = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default SkillTree;
