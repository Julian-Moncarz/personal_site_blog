let localStorageAvailable = true;
let inMemoryColorScheme = null;

const testLocalStorage = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    console.log('[Dark Mode] localStorage available: true');
    return true;
  } catch(e) {
    console.log('[Dark Mode] localStorage NOT available:', e.message);
    return false;
  }
};

localStorageAvailable = testLocalStorage();

const getColorScheme = () => {
  if (localStorageAvailable) {
    try {
      const value = localStorage.getItem('colorScheme');
      console.log('[Dark Mode] getColorScheme from localStorage:', value);
      return value;
    } catch(e) {
      console.log('[Dark Mode] Error reading localStorage:', e.message);
      localStorageAvailable = false;
    }
  }
  console.log('[Dark Mode] getColorScheme from memory:', inMemoryColorScheme);
  return inMemoryColorScheme;
};

const setColorScheme = (value) => {
  console.log('[Dark Mode] setColorScheme:', value);
  if (localStorageAvailable) {
    try {
      localStorage.setItem('colorScheme', value);
      inMemoryColorScheme = value;
      console.log('[Dark Mode] Saved to localStorage:', value);
      return;
    } catch(e) {
      console.log('[Dark Mode] Error writing localStorage:', e.message);
      localStorageAvailable = false;
    }
  }
  inMemoryColorScheme = value;
  console.log('[Dark Mode] Saved to memory:', value);
};

const toggle = document.querySelector('#color-mode-switch input[type="checkbox"]');
console.log('[Dark Mode] Toggle element found:', !!toggle);

const toggleDarkMode = () => {
  const root = document.querySelector('html');
  if (!root) {
    console.log('[Dark Mode] ERROR: html element not found!');
    return;
  }
  
  const currentClasses = root.className;
  console.log('[Dark Mode] Current html classes:', currentClasses);
  
  if (root.classList.contains('dark')) {
    root.classList.remove('dark');
    root.classList.add('light');
    console.log('[Dark Mode] Switched from dark to light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    console.log('[Dark Mode] Switched from light to dark');
  }
  
  console.log('[Dark Mode] New html classes:', root.className);
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
  console.log('[Dark Mode] Toggle clicked, checked:', toggle?.checked);
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    toggleDarkMode();
    toggleColorScheme();
  }, 50);
};

if (toggle) {
  toggle.addEventListener('change', handleToggle);
  console.log('[Dark Mode] Event listener attached to toggle');
} else {
  console.log('[Dark Mode] WARNING: Toggle not found, event listener not attached');
}

const checkColorScheme = () => {
  console.log('[Dark Mode] checkColorScheme called');
  const colorScheme = getColorScheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const root = document.querySelector('html');
  
  console.log('[Dark Mode] prefersDark (system):', prefersDark);
  console.log('[Dark Mode] colorScheme (stored):', colorScheme);
  
  if (!root) {
    console.log('[Dark Mode] ERROR: html element not found in checkColorScheme!');
    return;
  }
  
  if (colorScheme === null || colorScheme === undefined) {
    console.log('[Dark Mode] No stored preference, using system preference');
    if (prefersDark) {
      setColorScheme('dark');
      if (toggle) {
        toggle.checked = true;
        console.log('[Dark Mode] Set toggle checked: true');
      }
      root.classList.remove('light');
      root.classList.add('dark');
      console.log('[Dark Mode] Applied dark mode (system default)');
    } else {
      setColorScheme('light');
      if (toggle) {
        toggle.checked = false;
        console.log('[Dark Mode] Set toggle checked: false');
      }
      root.classList.remove('dark');
      root.classList.add('light');
      console.log('[Dark Mode] Applied light mode (system default)');
    }
  } else if (colorScheme === 'dark') {
    console.log('[Dark Mode] Applying stored dark mode preference');
    if (toggle) {
      toggle.checked = true;
      console.log('[Dark Mode] Set toggle checked: true');
    }
    root.classList.remove('light');
    root.classList.add('dark');
  } else if (colorScheme === 'light') {
    console.log('[Dark Mode] Applying stored light mode preference');
    if (toggle) {
      toggle.checked = false;
      console.log('[Dark Mode] Set toggle checked: false');
    }
    root.classList.remove('dark');
    root.classList.add('light');
  }
  
  console.log('[Dark Mode] Final html classes:', root.className);
  console.log('[Dark Mode] Final toggle state:', toggle?.checked);
};

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSystemThemeChange = (e) => {
  console.log('[Dark Mode] System theme changed, now prefers dark:', e.matches);
  const colorScheme = getColorScheme();
  if (!colorScheme) {
    console.log('[Dark Mode] No user preference, updating to match system');
    const root = document.querySelector('html');
    if (!root) {
      console.log('[Dark Mode] ERROR: html element not found in handleSystemThemeChange!');
      return;
    }
    
    if (e.matches) {
      setColorScheme('dark');
      if (toggle) toggle.checked = true;
      root.classList.remove('light');
      root.classList.add('dark');
      console.log('[Dark Mode] Updated to dark mode (system change)');
    } else {
      setColorScheme('light');
      if (toggle) toggle.checked = false;
      root.classList.remove('dark');
      root.classList.add('light');
      console.log('[Dark Mode] Updated to light mode (system change)');
    }
  } else {
    console.log('[Dark Mode] User preference exists, ignoring system change');
  }
};

if (darkModeMediaQuery.addEventListener) {
  darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
  console.log('[Dark Mode] System theme listener added (addEventListener)');
} else if (darkModeMediaQuery.addListener) {
  darkModeMediaQuery.addListener(handleSystemThemeChange);
  console.log('[Dark Mode] System theme listener added (addListener)');
}

console.log('[Dark Mode] Initializing...');
checkColorScheme();
console.log('[Dark Mode] Initialization complete');
