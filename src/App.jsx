

import { useState } from 'react';
import HomePage from './components/HomePage';
import GameDetail from './components/GameDetail';

function App() {
  const [selectedGameId, setSelectedGameId] = useState(null);

  const handleGameClick = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleCloseDetail = () => {
    setSelectedGameId(null);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <HomePage onGameClick={handleGameClick} />
      {selectedGameId && (
        <GameDetail
          gameId={selectedGameId}
          onClose={handleCloseDetail}
        />
      )}
    </main>
  );
}

export default App
