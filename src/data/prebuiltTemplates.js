export const PREBUILT_TEMPLATES = [
  {
    id: 'db-only-5day',
    name: 'Dumbbell-Only 5-Day',
    description: 'Push/Pull/Legs split using only dumbbells',
    type: 'prebuilt',
    days: [
      {
        name: 'Push Day',
        exercises: [
          { name: 'DB Bench Press', sets: 4, reps: 8 },
          { name: 'DB Shoulder Press', sets: 3, reps: 10 },
          { name: 'DB Lateral Raise', sets: 3, reps: 12 },
          { name: 'DB Tricep Kickback', sets: 3, reps: 12 },
        ]
      },
      {
        name: 'Pull Day',
        exercises: [
          { name: 'DB Bent-Over Row', sets: 4, reps: 8 },
          { name: 'DB Single-Arm Row', sets: 3, reps: 10 },
          { name: 'DB Bicep Curl', sets: 3, reps: 12 },
          { name: 'DB Hammer Curl', sets: 3, reps: 12 },
        ]
      },
      {
        name: 'Legs',
        exercises: [
          { name: 'DB Goblet Squat', sets: 4, reps: 10 },
          { name: 'DB RDL', sets: 3, reps: 10 },
          { name: 'DB Lunges', sets: 3, reps: 10 },
          { name: 'DB Calf Raise', sets: 3, reps: 15 },
        ]
      },
      {
        name: 'Upper',
        exercises: [
          { name: 'DB Incline Press', sets: 3, reps: 10 },
          { name: 'DB Pullover', sets: 3, reps: 10 },
          { name: 'DB Arnold Press', sets: 3, reps: 10 },
          { name: 'DB Overhead Extension', sets: 3, reps: 10 },
        ]
      },
      {
        name: 'Lower + Core',
        exercises: [
          { name: 'DB Bulgarian Split Squat', sets: 3, reps: 10 },
          { name: 'DB Step-up', sets: 3, reps: 10 },
          { name: 'DB Renegade Row', sets: 3, reps: 8 },
          { name: 'Front Plank', sets: 3, reps: '45s' },
        ]
      }
    ]
  },
  {
    id: 'fullbody-3day',
    name: 'Full Body 3-Day',
    description: 'Full body workouts three days per week',
    type: 'prebuilt',
    days: [
      {
        name: 'Full Body A',
        exercises: [
          { name: 'DB Goblet Squat', sets: 3, reps: 12 },
          { name: 'DB Bench Press', sets: 3, reps: 10 },
          { name: 'DB Bent-Over Row', sets: 3, reps: 10 },
          { name: 'DB Shoulder Press', sets: 3, reps: 10 },
          { name: 'Front Plank', sets: 3, reps: '45s' },
        ]
      },
      {
        name: 'Full Body B',
        exercises: [
          { name: 'DB RDL', sets: 3, reps: 10 },
          { name: 'DB Incline Press', sets: 3, reps: 10 },
          { name: 'DB Single-Arm Row', sets: 3, reps: 10 },
          { name: 'DB Lunges', sets: 3, reps: 10 },
          { name: 'Dead Bug', sets: 3, reps: 12 },
        ]
      },
      {
        name: 'Full Body C',
        exercises: [
          { name: 'DB Step-up', sets: 3, reps: 10 },
          { name: 'DB Fly', sets: 3, reps: 12 },
          { name: 'DB Pullover', sets: 3, reps: 10 },
          { name: 'DB Lateral Raise', sets: 3, reps: 12 },
          { name: 'Superman Hold', sets: 3, reps: '45s' },
        ]
      }
    ]
  }
]
