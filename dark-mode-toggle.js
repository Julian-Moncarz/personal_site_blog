let localStorageAvailable = true;
let inMemoryColorScheme = null;

const testLocalStorage = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
};

localStorageAvailable = testLocalStorage();

const getColorScheme = () => {
  if (localStorageAvailable) {
    try {
      const value = localStorage.getItem('colorScheme');
      return value;
    } catch(e) {
      localStorageAvailable = false;
    }
  }
  return inMemoryColorScheme;
};

const setColorScheme = (value) => {
  if (localStorageAvailable) {
    try {
      localStorage.setItem('colorScheme', value);
      inMemoryColorScheme = value;
      return;
    } catch(e) {
      localStorageAvailable = false;
    }
  }
  inMemoryColorScheme = value;
};

const toggle = document.querySelector('#color-mode-switch input[type="checkbox"]');

const toggleDarkMode = () => {
  const root = document.querySelector('html');
  if (!root) return;
  
  if (root.classList.contains('dark')) {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
};

const toggleColorScheme = () => {
  const colorScheme = getColorScheme();
  if (colorScheme === 'light') {
    setColorScheme('dark');
  } else {
    setColorScheme('light');
  }
};

let debounceTimer;
const handleToggle = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    toggleDarkMode();
    toggleColorScheme();
  }, 50);
};

if (toggle) {
  toggle.addEventListener('change', handleToggle);
}

const checkColorScheme = () => {
  const colorScheme = getColorScheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const root = document.querySelector('html');
  
  if (!root) return;
  
  if (colorScheme === null || colorScheme === undefined) {
    if (prefersDark) {
      setColorScheme('dark');
      if (toggle) toggle.checked = true;
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      setColorScheme('light');
      if (toggle) toggle.checked = false;
      root.classList.remove('dark');
      root.classList.add('light');
    }
  } else if (colorScheme === 'dark') {
    if (toggle) toggle.checked = true;
    root.classList.remove('light');
    root.classList.add('dark');
  } else if (colorScheme === 'light') {
    if (toggle) toggle.checked = false;
    root.classList.remove('dark');
    root.classList.add('light');
  }
};

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSystemThemeChange = (e) => {
  const colorScheme = getColorScheme();
  if (!colorScheme) {
    const root = document.querySelector('html');
    if (!root) return;
    
    if (e.matches) {
      setColorScheme('dark');
      if (toggle) toggle.checked = true;
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      setColorScheme('light');
      if (toggle) toggle.checked = false;
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }
};

if (darkModeMediaQuery.addEventListener) {
  darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
} else if (darkModeMediaQuery.addListener) {
  darkModeMediaQuery.addListener(handleSystemThemeChange);
}

checkColorScheme();
