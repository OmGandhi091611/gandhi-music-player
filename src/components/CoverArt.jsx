function CoverArt({ cover, title, className = "", iconClassName = "" }) {
  if (cover) {
    return <img src={cover} alt={title} className={className} />;
  }

  return (
    <div className={`cover-fallback ${className}`.trim()}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`music-fallback-icon ${iconClassName}`.trim()}
        aria-hidden="true"
      >
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
      </svg>
    </div>
  );
}

export default CoverArt;