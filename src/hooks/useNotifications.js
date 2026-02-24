export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleWorkoutReminder = (time = '18:00', title = 'Time to train!', body = 'Your workout is waiting for you.') => {
  if (Notification.permission === 'granted') {
    // Basic implementation: setup a timeout for today if time > now
    // For a robust PWA, this would use Service Worker and Background Sync
    // But for MVP, simple setTimeout for demo purposes
    
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const targetTime = new Date(now);
    targetTime.setHours(hours, minutes, 0, 0);
    
    let timeToWait = targetTime.getTime() - now.getTime();
    
    if (timeToWait > 0 && timeToWait < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        new Notification(title, {
          body: body,
          icon: '/apple-touch-icon.png'
        });
      }, timeToWait);
    }
  }
};
