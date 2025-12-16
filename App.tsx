import React, { useState } from 'react';
import EscapeRoom1 from './EscapeRoom1';
import MainMenu from './MainMenu';

const App: React.FC = () => {
  // Simple state-based routing
  const [currentView, setCurrentView] = useState<'MENU' | 'ROOM_1'>('MENU');

  const handleSelectRoom = (roomId: string) => {
    if (roomId === 'room1') {
      setCurrentView('ROOM_1');
    }
    // Future rooms would be handled here
  };

  const handleReturnToMenu = () => {
    setCurrentView('MENU');
  };

  return (
    <>
      {currentView === 'MENU' && <MainMenu onSelect={handleSelectRoom} />}
      {currentView === 'ROOM_1' && <EscapeRoom1 onExit={handleReturnToMenu} />}
    </>
  );
};

export default App;