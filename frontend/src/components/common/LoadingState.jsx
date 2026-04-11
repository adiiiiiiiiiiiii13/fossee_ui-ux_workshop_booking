export default function LoadingState({ label = 'Loading...', fullscreen = false }) {
  return (
    <div className={`loading-state ${fullscreen ? 'loading-fullscreen' : ''}`}>
      <div className="loading-spinner" />
      <p>{label}</p>
    </div>
  );
}
