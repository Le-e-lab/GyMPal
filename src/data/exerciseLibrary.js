export const exerciseLibrary = [
  {
    id: 'pushup-standard',
    name: 'Standard Push-up',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      pushingPower: 0.8,
      coreStability: 0.3,
      shoulderStability: 0.4
    },
    instructions: [
      'Start in a high plank with hands below shoulders.',
      'Lower chest while keeping your body in one line.',
      'Press back up without flaring elbows too far out.',
    ],
  },
  {
    id: 'pushup-diamond',
    name: 'Diamond Push-up',
    muscleGroup: 'Triceps',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      pushingPower: 0.9,
      tricepsStrength: 0.9,
      coreStability: 0.3
    },
    instructions: [
      'Place hands close together under chest forming a diamond.',
      'Lower with elbows tracking near your torso.',
      'Push through palms and fully lock out at the top.',
    ],
  },
  {
    id: 'pike-pushup',
    name: 'Pike Push-up',
    muscleGroup: 'Shoulders',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      pushingPower: 0.7,
      shoulderStrength: 0.9,
      coreStability: 0.4
    },
    instructions: [
      'Lift hips high into an inverted V position.',
      'Lower head between hands toward the floor.',
      'Press back up focusing on shoulder drive.',
    ],
  },
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      legStrength: 0.8,
      coreStability: 0.2,
      mobility: 0.3
    },
    instructions: [
      'Stand feet shoulder-width apart and brace core.',
      'Sit hips back and down until thighs are near parallel.',
      'Drive through midfoot to stand tall again.',
    ],
  },
  {
    id: 'jump-squat',
    name: 'Jump Squat',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Plyometric',
    skills: {
      explosivePower: 0.9,
      legStrength: 0.7,
      cardio: 0.5
    },
    instructions: [
      'Squat to quarter-depth with chest up.',
      'Explode upward and leave the ground softly.',
      'Land with bent knees and reset for next rep.',
    ],
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      legStrength: 0.9,
      balance: 0.7,
      coreStability: 0.4
    },
    instructions: [
      'Place rear foot on bench or couch edge.',
      'Lower front knee while torso stays upright.',
      'Drive through front heel to return up.',
    ],
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    muscleGroup: 'Glutes',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      gluteStrength: 0.8,
      hipMobility: 0.5,
      coreStability: 0.3
    },
    instructions: [
      'Lie on your back with knees bent.',
      'Push through heels to lift hips.',
      'Squeeze glutes at top then lower with control.',
    ],
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Conditioning',
    skills: {
      cardio: 0.8,
      coreEndurance: 0.7,
      shoulderStability: 0.4
    },
    instructions: [
      'Start in plank with shoulders stacked over wrists.',
      'Drive one knee to chest then switch quickly.',
      'Keep hips stable and avoid bouncing up.',
    ],
  },
  {
    id: 'plank-front',
    name: 'Front Plank',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isometric',
    skills: {
      coreStability: 0.9,
      shoulderStability: 0.4,
      mentalToughness: 0.5
    },
    instructions: [
      'Place elbows under shoulders.',
      'Brace abs and squeeze glutes.',
      'Hold straight body line without sagging lower back.',
    ],
  },
  {
    id: 'plank-side',
    name: 'Side Plank',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Isometric',
    skills: {
      coreStability: 0.8,
      obliqueStrength: 0.9,
      shoulderStability: 0.5
    },
    instructions: [
      'Stack elbow under shoulder and feet together.',
      'Lift hips to form a straight line.',
      'Hold and breathe through your brace.',
    ],
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Stability',
    skills: {
      coreStability: 0.8,
      coordination: 0.7,
      lowerBackHealth: 0.9
    },
    instructions: [
      'Lie on your back with arms up and knees bent.',
      'Extend opposite arm and leg slowly.',
      'Return and alternate while keeping lower back flat.',
    ],
  },
  {
    id: 'v-up',
    name: 'V-Up',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      coreStrength: 0.9,
      hipFlexorStrength: 0.7,
      coordination: 0.5
    },
    instructions: [
      'Lie extended with arms overhead.',
      'Lift legs and torso simultaneously into a V shape.',
      'Lower under control before next rep.',
    ],
  },
  {
    id: 'superman-hold',
    name: 'Superman Hold',
    muscleGroup: 'Back',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isometric',
    skills: {
      lowerBackStrength: 0.8,
      posteriorChain: 0.7,
      shoulderMobility: 0.4
    },
    instructions: [
      'Lie face down and extend arms forward.',
      'Lift chest and legs slightly from floor.',
      'Hold while keeping neck neutral.',
    ],
  },
  {
    id: 'ytw-raise',
    name: 'Prone Y-T-W Raise',
    muscleGroup: 'Back',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Mobility',
    skills: {
      shoulderMobility: 0.8,
      scapularControl: 0.9,
      posture: 0.7
    },
    instructions: [
      'Lie face down with forehead supported.',
      'Raise arms in Y, T, then W patterns.',
      'Move slowly and squeeze shoulder blades.',
    ],
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raise',
    muscleGroup: 'Calves',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      calfStrength: 0.9,
      ankleStability: 0.6,
      explosivePower: 0.3
    },
    instructions: [
      'Stand tall and hold support if needed.',
      'Rise onto balls of feet.',
      'Pause at top then lower slowly.',
    ],
  },
  {
    id: 'step-up',
    name: 'Step-up',
    muscleGroup: 'Legs',
    equipment: 'Bench',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      legStrength: 0.8,
      balance: 0.7,
      explosivePower: 0.4
    },
    instructions: [
      'Place one foot on bench or sturdy box.',
      'Drive through planted foot to stand on top.',
      'Lower with control and switch legs.',
    ],
  },
  {
    id: 'jumping-jack',
    name: 'Jumping Jack',
    muscleGroup: 'Full Body',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Conditioning',
    skills: {
      cardio: 0.7,
      coordination: 0.6,
      fullBodyEndurance: 0.5
    },
    instructions: [
      'Jump feet out while lifting arms overhead.',
      'Return to starting stance with soft landing.',
      'Maintain rhythmic breathing throughout.',
    ],
  },
  {
    id: 'high-knee-run',
    name: 'High Knees',
    muscleGroup: 'Cardio',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Conditioning',
    skills: {
      cardio: 0.9,
      legEndurance: 0.7,
      explosivePower: 0.5
    },
    instructions: [
      'Run in place driving knees toward hip height.',
      'Pump arms quickly to match cadence.',
      'Stay on balls of feet for fast turnover.',
    ],
  },
  {
    id: 'burpee',
    name: 'Burpee',
    muscleGroup: 'Full Body',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    type: 'Conditioning',
    skills: {
      cardio: 0.9,
      fullBodyStrength: 0.8,
      explosivePower: 0.9,
      mentalToughness: 0.8
    },
    instructions: [
      'Drop hands down and kick feet to plank.',
      'Perform a push-up if programmed.',
      'Jump feet in and explode upward.',
    ],
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Body Hold',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Isometric',
    skills: {
      coreStrength: 0.9,
      lowerBackControl: 0.8,
      pelvicStability: 0.7
    },
    instructions: [
      'Lie on back and press low back into floor.',
      'Lift shoulders and legs slightly.',
      'Maintain tension without losing spinal position.',
    ],
  },
  {
    id: 'wall-walk',
    name: 'Wall Walk',
    muscleGroup: 'Shoulders',
    equipment: 'Wall',
    difficulty: 'Advanced',
    type: 'Strength',
    skills: {
      shoulderStrength: 0.9,
      shoulderMobility: 0.8,
      coreStability: 0.7,
      mentalToughness: 0.6
    },
    instructions: [
      'Start in push-up position near a wall.',
      'Walk feet up the wall while hands move in.',
      'Reverse slowly to return with control.',
    ],
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      legStrength: 0.7,
      balance: 0.6,
      hipMobility: 0.5
    },
    instructions: [
      'Step one leg backward into lunge.',
      'Lower rear knee toward floor.',
      'Drive through front foot to stand and switch.',
    ],
  },
  {
    id: 'single-leg-rdl',
    name: 'Single-Leg RDL',
    muscleGroup: 'Hamstrings',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Stability',
    skills: {
      hamstringStrength: 0.8,
      balance: 0.9,
      posteriorChain: 0.7
    },
    instructions: [
      'Stand on one leg with soft knee bend.',
      'Hinge hips and extend opposite leg back.',
      'Return upright while keeping balance.',
    ],
  },
  {
    id: 'tempo-squat',
    name: 'Tempo Squat',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      legStrength: 0.8,
      control: 0.9,
      coreStability: 0.3
    },
    instructions: [
      'Lower for a strict three-count.',
      'Pause briefly at bottom.',
      'Stand up with control and repeat.',
    ],
  },
  // Pull-up variations (will need a pull-up bar, but keeping for skill mapping)
  {
    id: 'pullup-assisted',
    name: 'Assisted Pull-up',
    muscleGroup: 'Back',
    equipment: 'Pull-up Bar',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      pullingStrength: 0.6,
      gripStrength: 0.5,
      coreStability: 0.3
    },
    instructions: [
      'Use resistance band or assisted machine.',
      'Pull chest to bar with controlled motion.',
      'Lower with full arm extension.',
    ],
  },
  {
    id: 'pullup-standard',
    name: 'Standard Pull-up',
    muscleGroup: 'Back',
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      pullingStrength: 0.9,
      gripStrength: 0.8,
      coreStability: 0.4
    },
    instructions: [
      'Hang from bar with overhand grip, slightly wider than shoulders.',
      'Pull chest to bar, squeezing shoulder blades.',
      'Lower with control to full arm extension.',
    ],
  },
  {
    id: 'pullup-weight',
    name: 'Weighted Pull-up',
    muscleGroup: 'Back',
    equipment: 'Pull-up Bar + Weight',
    difficulty: 'Advanced',
    type: 'Strength',
    skills: {
      pullingStrength: 1.0,
      gripStrength: 0.9,
      coreStability: 0.5
    },
    instructions: [
      'Add weight via belt or vest.',
      'Perform strict pull-up with controlled tempo.',
      'Focus on scapular retraction and depression.',
    ],
  },
  {
    id: 'chinup-standard',
    name: 'Standard Chin-up',
    muscleGroup: 'Back',
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      pullingStrength: 0.8,
      bicepStrength: 0.9,
      coreStability: 0.4
    },
    instructions: [
      'Hang from bar with underhand grip, shoulder width apart.',
      'Pull chin to bar, keeping elbows close to body.',
      'Lower with control to full arm extension.',
    ],
  },
  // Rows for horizontal pulling
  {
    id: 'bodyweight-row',
    name: 'Bodyweight Row',
    muscleGroup: 'Back',
    equipment: 'Table or Bar',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      pullingStrength: 0.7,
      gripStrength: 0.6,
      posteriorChain: 0.4
    },
    instructions: [
      'Lie under sturdy table or bar, grab with overhand grip.',
      'Pull chest to bar, keeping body straight.',
      'Lower with control.',
    ],
  },
  {
    id: 'inverted-row',
    name: 'Inverted Row',
    muscleGroup: 'Back',
    equipment: 'Table or Bar',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      pullingStrength: 0.8,
      gripStrength: 0.7,
      posteriorChain: 0.5
    },
    instructions: [
      'Position body at angle, feet on ground, hands on bar.',
      'Pull chest to bar, squeeze shoulder blades.',
      'Lower with control.',
    ],
  },
  // Dips for pushing
  {
    id: 'dips-assisted',
    name: 'Assisted Dips',
    muscleGroup: 'Triceps',
    equipment: 'Parallel Bars',
    difficulty: 'Beginner',
    type: 'Strength',
    skills: {
      pushingPower: 0.6,
      tricepsStrength: 0.7,
      shoulderStability: 0.5
    },
    instructions: [
      'Use resistance band or assisted machine.',
      'Lower body until elbows at 90 degrees.',
      'Press up to full arm extension.',
    ],
  },
  {
    id: 'dips-standard',
    name: 'Standard Dips',
    muscleGroup: 'Triceps',
    equipment: 'Parallel Bars',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      pushingPower: 0.8,
      tricepsStrength: 0.9,
      shoulderStability: 0.6
    },
    instructions: [
      'Support weight on parallel bars, arms straight.',
      'Lower until shoulders below elbows.',
      'Push up to full arm extension.',
    ],
  },
  // Handstand progressions
  {
    id: 'pike-pushup-feet-elevated',
    name: 'Pike Push-up (Feet Elevated)',
    muscleGroup: 'Shoulders',
    equipment: 'Bodyweight + Elevated Surface',
    difficulty: 'Intermediate',
    type: 'Strength',
    skills: {
      pushingPower: 0.8,
      shoulderStrength: 0.9,
      coreStability: 0.5
    },
    instructions: [
      'Place feet on elevated surface, hips high.',
      'Form inverted V shape with body.',
      'Lower head toward ground, press back up.',
    ],
  },
  {
    id: 'handstand-wall',
    name: 'Handstand Against Wall',
    muscleGroup: 'Shoulders',
    equipment: 'Wall',
    difficulty: 'Advanced',
    type: 'Strength',
    skills: {
      shoulderStrength: 1.0,
      coreStability: 0.8,
      balance: 0.7
    },
    instructions: [
      'Kick up to handstand with back to wall.',
      'Keep body straight, engage core.',
      'Hold position with control.',
    ],
  },
  // Core advanced
  {
    id: 'l-sit',
    name: 'L-Sit',
    muscleGroup: 'Core',
    equipment: 'Parallel Bars or Ground',
    difficulty: 'Advanced',
    type: 'Strength',
    skills: {
      coreStrength: 1.0,
      hipFlexorStrength: 0.9,
      shoulderStability: 0.7,
      mentalToughness: 0.8
    },
    instructions: [
      'Support weight on hands, legs extended straight out.',
      'Hold torso vertical, legs horizontal.',
      'Engage core and keep shoulders down.',
    ],
  },
  {
    id: 'planche-tuck',
    name: 'Tuck Planche',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    type: 'Strength',
    skills: {
      coreStrength: 0.9,
      pushingPower: 0.8,
      shoulderStrength: 0.9,
      mentalToughness: 0.9
    },
    instructions: [
      'Squat on hands, knees tucked to chest.',
      'Lean forward, lift feet off ground.',
      'Hold body parallel to ground.',
    ],
  },
];