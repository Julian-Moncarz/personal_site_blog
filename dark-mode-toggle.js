const toggle = document.querySelector('#color-mode-switch input[type="checkbox"]');

const toggleDarkMode = () => {
  const root = document.querySelector('html');
  if (root.classList.contains('dark')) {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
}

const toggleColorScheme = () => {
  const colorScheme = localStorage.getItem('colorScheme');
  if (colorScheme === 'light') localStorage.setItem('colorScheme', 'dark');
  else localStorage.setItem('colorScheme', 'light');
}

const handleToggle = () => {
  toggleDarkMode();
  toggleColorScheme();
};

if (toggle) {
  toggle.addEventListener('change', handleToggle);
}

const checkColorScheme = () => {
  const colorScheme = localStorage.getItem('colorScheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (colorScheme === null || colorScheme === undefined) {
    if (prefersDark) {
      localStorage.setItem('colorScheme', 'dark');
      if (toggle) {
        toggle.checked = true;
        document.querySelector('html').classList.add('dark');
      }
    } else {
      localStorage.setItem('colorScheme', 'light');
    }
  } else if (colorScheme === 'dark') {
    if (toggle) toggle.checked = true;
    document.querySelector('html').classList.add('dark');
  } else if (colorScheme === 'light') {
    if (toggle) toggle.checked = false;
    document.querySelector('html').classList.add('light');
  }
}
checkColorScheme();
