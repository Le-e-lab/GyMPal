const noop = () => {};

export const safeLocalStorage = {
  get(key, onError = noop) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      onError(error);
      return null;
    }
  },
  set(key, value, onError = noop) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      onError(error);
      return false;
    }
  },
  remove(key, onError = noop) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      onError(error);
      return false;
    }
  },
  getJSON(key, fallback, validate, onError = noop) {
    const raw = this.get(key, onError);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (validate && !validate(parsed)) return fallback;
      return parsed;
    } catch (error) {
      onError(error);
      return fallback;
    }
  },
  setJSON(key, value, onError = noop) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      onError(error);
      return false;
    }
  }
};

export const toDateKey = (date) => {
  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return normalized.toISOString().split('T')[0];
};
