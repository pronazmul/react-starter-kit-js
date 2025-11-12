import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from './app/hooks';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const { mode, accent } = useAppSelector(s => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply accent color
    root.setAttribute('data-accent', accent === 'blue' ? '' : accent);
  }, [mode, accent]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
