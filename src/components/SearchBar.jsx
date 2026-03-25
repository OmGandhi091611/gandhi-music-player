function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrap">
      <input
        type="text"
        className="search-input"
        placeholder="Search songs, artists, albums..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;