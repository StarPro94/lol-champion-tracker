interface ProgressBarProps {
  played: number;
  total: number;
}

export function ProgressBar({ played, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((played / total) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="progress-stats">
        <span className="progress-count">
          <strong>{played}</strong> / {total} champion{total > 1 ? 's' : ''} joué{played > 1 ? 's' : ''}
        </span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
