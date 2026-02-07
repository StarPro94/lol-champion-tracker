import React, { useState, useRef } from 'react';
import { exportData, importData, resetData } from '../utils/storage';
import './ImportExport.css';

interface ImportExportProps {
  onRefresh?: () => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ onRefresh }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importMode, setImportMode] = useState<'none' | 'replace' | 'merge'>('none');
  const [showImportMenu, setShowImportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lol-champion-tracker-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('L\'export a échoué. Veuillez réessayer.');
    }
  };

  const handleImportClick = (mode: 'replace' | 'merge') => {
    setImportMode(mode);
    setShowImportMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importData(content, importMode === 'merge');

        if (success) {
          onRefresh?.();
          alert(
            importMode === 'merge'
              ? 'Données importées et fusionnées avec succès !'
              : 'Données importées avec succès !'
          );
        } else {
          alert('L\'import a échoué. Vérifiez le format du fichier.');
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert('L\'import a échoué. Vérifiez le format du fichier.');
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (showResetConfirm) {
      if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.')) {
        const success = resetData();
        if (success) {
          onRefresh?.();
          alert('Progression réinitialisée avec succès !');
        } else {
          alert('La réinitialisation a échoué. Veuillez réessayer.');
        }
        setShowResetConfirm(false);
      }
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="import-export">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="action-buttons">
        <button
          type="button"
          className="action-button export-button"
          onClick={handleExport}
          title="Exporter votre progression"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M2.25 12.75V13.5C2.25 14.7426 3.25736 15.75 4.5 15.75H13.5C14.7426 15.75 15.75 14.7426 15.75 13.5V12.75M9 10.5V2.25M9 2.25L5.25 6M9 2.25L12.75 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Exporter
        </button>

        <div className="import-dropdown">
          <button
            type="button"
            className="action-button import-button"
            onClick={() => setShowImportMenu(!showImportMenu)}
            title="Importer une progression"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M15.75 5.25V4.5C15.75 3.25736 14.7426 2.25 13.5 2.25H4.5C3.25736 2.25 2.25 3.25736 2.25 4.5V5.25M9 7.5V15.75M9 15.75L12.75 12M9 15.75L5.25 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Importer
          </button>

          {showImportMenu && (
            <div className="import-menu">
              <button
                type="button"
                className="import-option"
                onClick={() => handleImportClick('merge')}
              >
                Fusionner
                <span className="import-option-hint">Ajouter aux données existantes</span>
              </button>
              <button
                type="button"
                className="import-option"
                onClick={() => handleImportClick('replace')}
              >
                Remplacer
                <span className="import-option-hint">Écraser les données existantes</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`action-button reset-button ${showResetConfirm ? 'confirm' : ''}`}
          onClick={handleReset}
          title={
            showResetConfirm
              ? 'Cliquez à nouveau pour confirmer'
              : 'Réinitialiser la progression'
          }
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M14.25 5.25L12.75 3.75M12.75 3.75L11.25 5.25M12.75 3.75V9M5.42952 4.02048C6.50428 3.37485 7.73478 3 9 3C12.7279 3 15.75 6.02208 15.75 9.75M3.75 13.5L5.25 15M5.25 15L6.75 13.5M5.25 15V9.75M12.5705 14.4795C11.4957 15.1252 10.2652 15.5 9 15.5C5.27208 15.5 2.25 12.4779 2.25 8.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {showResetConfirm ? 'Confirmer' : 'Réinitialiser'}
        </button>
      </div>
    </div>
  );
};
