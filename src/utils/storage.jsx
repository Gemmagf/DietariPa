export const getStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error getting data from localStorage", error);
    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving data to localStorage", error);
  }
};

// Nueva función para obtener el siguiente ID disponible
export const getNextId = (items) => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};


// DONE