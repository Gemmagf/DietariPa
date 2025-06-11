export const getStorage = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};