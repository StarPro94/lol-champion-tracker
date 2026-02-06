interface ActionButtonsProps {
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  playedCount: number;
}

export function ActionButtons({ onReset, onExport, onImport, playedCount }: ActionButtonsProps) {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImport(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (playedCount === 0) return;
    if (confirm(`Voulez-vous vraiment décocher tous les champions ? (${playedCount} champion${playedCount > 1 ? 's' : ''})`)) {
      onReset();
    }
  };

  return (
    <div className="action-buttons">
      <button
        className="action-btn secondary"
        onClick={handleReset}
        disabled={playedCount === 0}
        title="Tout décocher"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        Tout décocher
      </button>
      <button
        className="action-btn secondary"
        onClick={onExport}
        title="Exporter ma progression"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Exporter
      </button>
      <button
        className="action-btn primary"
        onClick={handleImportClick}
        title="Importer ma progression"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17,8 12,3 7,8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Importer
      </button>
    </div>
  );
}
