import { useState, useCallback, useEffect } from 'react';
import { useChampions } from './hooks/useChampions';
import { useFilters } from './hooks/useFilters';
import { useMilestone } from './hooks/useMilestone';
import { useStreak } from './hooks/useStreak';
import { useSound } from './hooks/useSound';
import { togglePlayed, toggleLaneRole } from './utils/storage';
import { getRandomUnplayedChampion } from './utils/filters';
import { ProgressBar } from './components/ProgressBar';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { StatsPanel } from './components/StatsPanel';
import { ChampionGrid } from './components/ChampionGrid';
import { ImportExport } from './components/ImportExport';
import { MilestoneCelebration } from './components/MilestoneCelebration';
import { StreakCounter } from './components/StreakCounter';
import { SoundToggle } from './components/SoundToggle';
import { AuthButton } from './components/AuthButton';
import { RiotAccountLink } from './components/RiotAccountLink';
import type { LaneRole } from './types/champion';
import './App.css';

function App() {
  const { champions, isLoading, error, refetch } = useChampions();
  const { filters, setFilters, resetFilters, filteredChampions, filterCount } =
    useFilters(champions);

  const [randomChampion, setRandomChampion] = useState<typeof champions[number] | null>(null);
  const [showRandomChampion, setShowRandomChampion] = useState(false);
  const [randomLaneRole, setRandomLaneRole] = useState<LaneRole | 'all'>('all');

  // Calculer les stats globales
  const playedCount = champions.filter((c) => c.isPlayed).length;
  const totalCount = champions.length;

  // Satisfying systems
  const { celebration, dismissCelebration } = useMilestone(playedCount, totalCount);
  const { streak, isVisible: streakVisible, incrementStreak, resetStreak } = useStreak();
  const { playClickSound, playMilestoneSound } = useSound();

  // Play milestone sound when celebration appears
  useEffect(() => {
    if (celebration) {
      playMilestoneSound();
    }
  }, [celebration, playMilestoneSound]);

  // Toggle joué
  const handleToggle = useCallback((championId: string) => {
    const champion = champions.find(c => c.id === championId);
    const wasPlayed = champion?.isPlayed ?? false;

    togglePlayed(championId);
    playClickSound();

    // Increment streak when marking a new champion as played
    if (!wasPlayed) {
      incrementStreak();
    } else {
      // Reset streak when unchecking (optional - removes the streak feeling)
      resetStreak();
    }

    refetch();
  }, [champions, incrementStreak, resetStreak, playClickSound, refetch]);

  // Toggle rôle lane
  const handleLaneRoleToggle = useCallback((championId: string, role: LaneRole) => {
    toggleLaneRole(championId, role);
    refetch();
  }, [refetch]);

  // Random champion - ouvrir la modal sans champion
  const handleRandomChampion = useCallback(() => {
    setRandomChampion(null); // Reset pour montrer le sélecteur de rôle
    setShowRandomChampion(true);
  }, []);

  // Tirer au sort un champion avec les filtres actuels
  const handleRollRandom = useCallback(() => {
    const laneRolesFilter = randomLaneRole === 'all' ? undefined : [randomLaneRole];
    const random = getRandomUnplayedChampion(champions, {
      tags: filters.tags.length > 0 ? filters.tags : undefined,
      partypes: filters.partypes.length > 0 ? filters.partypes : undefined,
      laneRoles: laneRolesFilter,
    });

    if (random) {
      setRandomChampion(random);
    } else {
      alert('Aucun champion non joué ne correspond aux critères !');
    }
  }, [champions, filters, randomLaneRole]);

  // Fermer la modal random
  const handleCloseRandom = () => {
    setShowRandomChampion(false);
    setRandomChampion(null);
  };

  // Jouer le champion aléatoire
  const handlePlayRandomChampion = () => {
    if (randomChampion) {
      handleToggle(randomChampion.id);
      setShowRandomChampion(false);
    }
  };

  // Gestion erreur localStorage
  useEffect(() => {
    const testStorage = () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      } catch (e) {
        console.warn('localStorage is not available');
      }
    };
    testStorage();
  }, []);

  if (error) {
    return (
      <div className="app app-error">
        <div className="error-container">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            className="error-icon"
          >
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
            <path
              d="M20 20L44 44M20 44L44 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h1>Erreur de chargement</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="app-title">
              <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="url(#logo-grad)" />
                <path
                  d="M10 8L22 8L22 14L28 14L28 24L4 24L4 14L10 14Z"
                  fill="#091428"
                />
                <circle cx="16" cy="16" r="5" fill="#C89B3C" />
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C89B3C" />
                    <stop offset="100%" stopColor="#0AC8B9" />
                  </linearGradient>
                </defs>
              </svg>
              <h1>LoL Champion Tracker</h1>
            </div>
            <p className="app-subtitle">Suivez votre progression sur tous les champions</p>
          </div>

          <div className="header-right">
            <AuthButton />
            <RiotAccountLink />
            <SoundToggle />
            <button
              type="button"
              className="random-champion-button"
              onClick={handleRandomChampion}
              disabled={isLoading || champions.length === 0}
              title="Suggérer un champion aléatoire non joué"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4L12 8H16L13 11L14 15L10 13L6 15L7 11L4 8H8L10 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Random
            </button>
            <ImportExport onRefresh={refetch} />
          </div>
        </div>

        <div className="progress-section">
          <ProgressBar played={playedCount} total={totalCount} />
        </div>
      </header>

      <main className="app-main">
        <div className="sidebar">
          <div className="sidebar-section">
            <SearchBar
              value={filters.search}
              onChange={(value) => setFilters({ search: value })}
            />
          </div>

          <div className="sidebar-section">
            <StatsPanel champions={champions} />
          </div>

          <div className="sidebar-section">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              champions={champions}
              filterCount={filterCount}
            />
          </div>
        </div>

        <div className="content">
          <ChampionGrid
            champions={filteredChampions}
            isLoading={isLoading}
            onToggle={handleToggle}
            onLaneRoleToggle={handleLaneRoleToggle}
            emptyMessage={
              filters.search || filters.status !== 'all' || filters.tags.length > 0
                ? 'Aucun champion ne correspond à vos critères'
                : 'Aucun champion disponible'
            }
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Données champions fournies par{' '}
          <a
            href="https://www.communitydragon.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CommunityDragon
          </a>{' '}
          et{' '}
          <a
            href="https://developer.riotgames.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Riot Games
          </a>
        </p>
        <p className="footer-note">
          Les données sont stockées localement dans votre navigateur.
        </p>
      </footer>

      {/* Modal Random Champion */}
      {showRandomChampion && (
        <div className="modal-overlay" onClick={handleCloseRandom}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={handleCloseRandom}
              aria-label="Fermer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {!randomChampion ? (
              <>
                <h2 className="modal-title">Champion aléatoire</h2>
                <p className="modal-subtitle">Choisissez un rôle (optionnel)</p>

                <div className="lane-role-selector">
                  <button
                    type="button"
                    className={`lane-role-option ${randomLaneRole === 'all' ? 'active' : ''}`}
                    onClick={() => setRandomLaneRole('all')}
                  >
                    Tous les rôles
                  </button>
                  {['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT', 'FLEX'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      className={`lane-role-option ${randomLaneRole === role ? 'active' : ''} ${role.toLowerCase()}`}
                      onClick={() => setRandomLaneRole(role as LaneRole)}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCloseRandom}>
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleRollRandom}
                  >
                    Tirer au sort
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title">Champion suggéré</h2>

                <div className="random-champion-card">
                  <img
                    src={randomChampion.imageUrl}
                    alt={randomChampion.name}
                    className="random-champion-image"
                  />
                  <div className="random-champion-info">
                    <h3>{randomChampion.name}</h3>
                    <p>{randomChampion.title}</p>
                    <div className="random-champion-tags">
                      {randomChampion.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {randomChampion.laneRoles.length > 0 && (
                      <div className="random-champion-roles">
                        {randomChampion.laneRoles.map((role) => (
                          <span key={role} className={`role-badge ${role.toLowerCase()}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="random-champion-difficulty">
                      Difficulté: {randomChampion.info.difficulty}/10
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleRollRandom}>
                    Un autre
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handlePlayRandomChampion}
                  >
                    Marquer comme joué
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Satisfying Systems */}
      {celebration && (
        <MilestoneCelebration milestone={celebration} onClose={dismissCelebration} />
      )}
      {streakVisible && <StreakCounter count={streak} />}
    </div>
  );
}

export default App;
