import { useEffect } from 'react';
import DoomsdayTerminal from './components/DoomsdayTerminal';

function App() {
  useEffect(() => {
    const audio = new Audio('/theme.mp3');
    audio.loop = true;
    audio.play().catch(error => {
      console.error('Failed to play audio:', error);
    });
  }, []);

  return (
    <div className="app">
      <img src="/download.gif" alt="background animation" className="video-background" />
      <DoomsdayTerminal />
    </div>
  );
}

export default App;