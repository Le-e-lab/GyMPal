const JOG_PRESETS = [
  {
    id: 'recovery',
    minDistance: 0,
    maxDistance: 2.99,
    title: 'Recovery Rebuild',
    description: 'Short jog day. Keep impact low and reinforce hips, core, and calf resilience.',
    intensity: 'Light',
    postWorkout: [
      '2x12 Reverse Lunges (bodyweight)',
      '2x15 Glute Bridges',
      '2x30s Side Plank (each side)',
      '2x15 Standing Calf Raises',
      '2x20 Dead Bugs',
    ],
  },
  {
    id: 'builder',
    minDistance: 3,
    maxDistance: 5.99,
    title: 'Engine Builder',
    description: 'Mid-distance run. Add posterior chain and trunk strength to improve pace durability.',
    intensity: 'Moderate',
    postWorkout: [
      '3x10 Bulgarian Split Squats (each leg)',
      '3x12 Single-Leg Romanian Deadlifts (bodyweight)',
      '3x40s Front Plank',
      '3x12 Push-ups',
      '3x20 Mountain Climbers',
    ],
  },
  {
    id: 'endurance',
    minDistance: 6,
    maxDistance: Number.POSITIVE_INFINITY,
    title: 'Long-Run Armor',
    description: 'Long run completed. Focus on stabilization, tendon care, and controlled strength work.',
    intensity: 'High',
    postWorkout: [
      '3x12 Step-ups (each leg)',
      '3x10 Tempo Squats (3s down)',
      '3x45s Hollow Hold',
      '3x15 Superman Raises',
      '3x15 Slow Calf Raises (2s pause at top)',
    ],
  },
];

export const DEFAULT_JOG_DISTANCE_KM = 3;

export const getJogPostWorkoutPlan = (distanceKm) => {
  const parsedDistance = Number.parseFloat(distanceKm);
  const safeDistance = Number.isNaN(parsedDistance) || parsedDistance < 0 ? 0 : parsedDistance;

  return JOG_PRESETS.find(
    (preset) => safeDistance >= preset.minDistance && safeDistance <= preset.maxDistance,
  );
};
