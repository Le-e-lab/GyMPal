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

// On-the-move exercises that can be done while jogging (no stopping needed)
export const ON_THE_MOVE_EXERCISES = [
  {
    id: 'high-knees',
    name: 'High Knees',
    description: 'Drive knees to hip height while jogging in place. Keeps hip flexors active and revs heart rate.',
    duration: '30s bursts',
    fatLossTip: 'High knees activate the largest lower-body muscles, spiking calorie burn per minute.',
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    description: 'Jog forward while kicking heels to glutes. Loosens quads and hamstrings between strides.',
    duration: '30s bursts',
    fatLossTip: 'The rapid hamstring contraction increases local blood flow and post-run calorie afterburn.',
  },
  {
    id: 'fartlek-bursts',
    name: 'Fartlek Bursts',
    description: 'Sprint at 80% effort for 30s, then jog easy for 60s. Repeat 3-5x throughout run.',
    duration: '30s on / 60s off',
    fatLossTip: 'HIIT-style bursts elevate EPOC (post-exercise oxygen consumption) — you keep burning fat for hours after.',
  },
  {
    id: 'arm-drive',
    name: 'Active Arm Drive',
    description: 'Exaggerate arm swing — pump elbows back hard, chest open. Engages upper body while running.',
    duration: 'Ongoing',
    fatLossTip: 'Engaging the upper body while running increases total muscle mass recruited, lifting total calorie burn.',
  },
  {
    id: 'breathing-cadence',
    name: 'Deep Breathing Cadence',
    description: 'Inhale for 4 footfalls, hold for 2, exhale for 4. Calms nervous system and improves oxygen efficiency.',
    duration: '2-3 min blocks',
    fatLossTip: 'Controlled breathing lowers cortisol, which helps reduce stress-driven belly fat storage.',
  },
  {
    id: 'side-shuffles',
    name: 'Side Shuffles',
    description: 'Turn sideways and shuffle 10 steps each direction while advancing. Activates glute med and stabilizers.',
    duration: '20s each side',
    fatLossTip: 'Lateral movement recruits glute med and adductors — muscles often underused in straight-line running.',
  },
  {
    id: 'skipping',
    name: 'Skipping Jog',
    description: 'Jog with a skip cadence — exaggerated bounce, opposite arm lift. Builds calf power and ankle stiffness.',
    duration: '60s bursts',
    fatLossTip: 'The plyometric element increases neuromuscular activation, boosting the metabolic cost of each stride.',
  },
];

export const FAT_LOSS_TIPS = [
  {
    title: 'Steady-State Burns Fat Long-Term',
    body: 'Jogging at a conversational pace keeps your heart rate in the "fat-burning zone" where a higher % of calories come from fat stores. Walking burns 81% fat, jogging ~40%, but total calorie burn is higher with jogging.',
  },
  {
    title: 'HIIT Bursts = Afterburn Effect',
    body: 'Adding 30s sprints to your run creates EPOC (excess post-exercise oxygen consumption). Your metabolism stays elevated for 12-48 hours after the run, burning more calories at rest.',
  },
  {
    title: 'Protein Timing Matters',
    body: 'Consuming 20-30g protein within 2 hours post-run improves muscle repair and thermic effect of food (TEF). Protein digestion burns ~25% of its calories — more than carbs or fat.',
  },
  {
    title: 'Ginger & Green Tea Support',
    body: 'Clinical studies show standardized ginger extract (GGE03) reduced body fat % and waist circumference over 12 weeks. Green tea catechins + caffeine can increase 24h energy expenditure by 4-5%. Combine with exercise, not replace it.',
  },
  {
    title: 'Sleep = Fat Loss Gear',
    body: 'Poor sleep raises ghrelin (hunger hormone) and lowers leptin (fullness). Aim for 7-9h — each lost hour of sleep correlates with higher BMI and more abdominal fat.',
  },
  {
    title: 'Consistency Beats Intensity',
    body: 'A 30-min jog 5x/week burns more fat long-term than a single 2-hour run. The most effective approach combines steady-state, HIIT bursts, and strength work across the week.',
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
