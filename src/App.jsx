import { useEffect, useMemo, useRef, useState } from "react";
import { songs } from "./data";
import SearchBar from "./components/SearchBar";
import SongList from "./components/SongList";
import PlayerScreen from "./components/PlayerScreen";

function App() {
  const audioRef = useRef(null);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [view, setView] = useState("library");
  const [loading, setLoading] = useState(true);

  const safeSongs = useMemo(() => {
    return songs.map((song, index) => ({
      ...song,
      id: song.id ?? `song-${index + 1}`,
    }));
  }, []);

  const currentSong = safeSongs[currentSongIndex] || safeSongs[0];

  const filteredSongs = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return safeSongs;

    return safeSongs.filter((song) => {
      return (
        song.title?.toLowerCase().includes(q) ||
        song.artist?.toLowerCase().includes(q) ||
        song.album?.toLowerCase().includes(q)
      );
    });
  }, [search, safeSongs]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex, currentSong]);

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDurationSeconds(audioRef.current.duration || 0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime || 0);
  };

  const handleSongSelect = (songId) => {
    const index = safeSongs.findIndex((song) => song.id === songId);
    if (index === -1) return;

    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    setView("player");
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % safeSongs.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + safeSongs.length) % safeSongs.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (value) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!safeSongs.length) {
    return (
      <div className="music-app-shell">
        <div className="empty-page">
          <h1>No songs found</h1>
          <p>Add songs to <code>src/data/index.js</code> and mp3 files to <code>public/audio</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-app-shell">
      <audio
        ref={audioRef}
        src={currentSong.src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      {view === "library" ? (
        <main className="library-screen">
          <section className="library-card glass">
            <div className="library-header">
              <div>
                <p className="eyebrow">Your Library</p>
                <h1>Music Player</h1>
              </div>
            </div>

            <SearchBar search={search} setSearch={setSearch} />

            <SongList
              songs={filteredSongs}
              currentSongId={currentSong.id}
              isPlaying={isPlaying}
              onSongSelect={handleSongSelect}
              loading={loading}
            />
          </section>
        </main>
      ) : (
        <PlayerScreen
          song={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          durationSeconds={durationSeconds}
          onBack={() => setView("library")}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={handleSeek}
          formatTime={formatTime}
          volume={volume}
          setVolume={setVolume}
        />
      )}
    </div>
  );
}

export default App;