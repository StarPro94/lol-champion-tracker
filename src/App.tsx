import { useState, useMemo } from 'react';
import { useChampions } from './hooks/useChampions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ChampionGrid } from './components/ChampionGrid';
import { ProgressBar } from './components/ProgressBar';
import { SearchBar } from './components/SearchBar';
import { FilterTabs } from './components/FilterTabs';
import { ActionButtons } from './components/ActionButtons';
import { exportToFile, importFromFile } from './utils/storage';
import './App.css';

type Filter = 'all' | 'played' | 'unplayed';

function App() {
  const { status: championsStatus, champions, version, error } = useChampions();
  const [status, toggleChampion, replaceStatus] = useLocalStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const playedCount = useMemo(() =>
    Object.values(status).filter(Boolean).length,
    [status]
  );

  const handleImport = async (file: File) => {
    try {
      const importedStatus = await importFromFile(file);
      replaceStatus(importedStatus);
      alert(`Import réussi ! ${Object.values(importedStatus).filter(Boolean).length} champions joués.`);
    } catch (err) {
      alert('Erreur lors de l\'import : fichier invalide');
    }
  };

  const handleReset = () => {
    replaceStatus({});
  };

  if (championsStatus === 'loading') {
    return (
      <div className="app">
        <div className="loading-state">
          <div className="spinner" />
          <p>Chargement des champions...</p>
        </div>
      </div>
    );
  }

  if (championsStatus === 'error') {
    return (
      <div className="app">
        <div className="error-state">
          <h2>Erreur de chargement</h2>
          <p>{error}</p>
          <p>Les serveurs Riot Data Dragon sont peut-être indisponibles. Réessayez plus tard.</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  const unplayedCount = champions.length - playedCount;

  return (
    <div className="app">
      <header className="header">
        <h1>LoL Champion Tracker</h1>
        <p className="subtitle">Jouez tous les champions de League of Legends</p>
      </header>

      <main className="main">
        <ProgressBar played={playedCount} total={champions.length} />

        <div className="controls">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterTabs
            current={filter}
            onChange={setFilter}
            playedCount={playedCount}
            unplayedCount={unplayedCount}
          />
        </div>

        <ChampionGrid
          champions={champions}
          version={version}
          status={status}
          onToggle={toggleChampion}
          searchQuery={searchQuery}
          filter={filter}
        />

        <ActionButtons
          onReset={handleReset}
          onExport={() => exportToFile(status)}
          onImport={handleImport}
          playedCount={playedCount}
        />
      </main>

      <footer className="footer">
        <p>Données champion fournies par <a href="https://developer.riotgames.com/" target="_blank" rel="noopener">Riot Games</a></p>
      </footer>
    </div>
  );
}

export default App;
