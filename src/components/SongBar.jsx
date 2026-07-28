import React from "react";
import { Link } from "react-router-dom";

import PlayPause from "./PlayPause";

const SongBar = ({
  song,
  i,
  artistId,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => {
  // compare by key, not title - two different songs can share a name
  const isActive = activeSong?.key && activeSong.key === song?.key;

  // the artist branch reads Apple Music-shaped fields; the {w}/{h} replace is
  // a no-op on our URLs but harmless, and ?. stops a missing url from crashing
  const artwork = artistId
    ? song?.attributes?.artwork?.url
        ?.replace("{w}", "125")
        .replace("{h}", "125") || song?.images?.coverart
    : song?.images?.coverart;

  const title = artistId ? song?.attributes?.name || song?.title : song?.title;
  // iTunes lookup has no albumName, so fall back to the artist name
  const caption = artistId
    ? song?.attributes?.albumName ||
      song?.attributes?.artistName ||
      song?.subtitle
    : song?.subtitle;

  return (
    <div
      className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${isActive ? "bg-[#4c426e]" : "bg-transparent"} py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base text-white mr-3 w-6 shrink-0">
        {i + 1}.
      </h3>
      <div className="flex-1 flex flex-row justify-between items-center min-w-0">
        {/* shrink-0 stops flex from squashing the thumb when titles run long */}
        <img
          className="w-20 h-20 rounded-lg object-cover shrink-0"
          src={artwork}
          alt={title}
        />
        <div className="flex-1 flex flex-col justify-center mx-3 min-w-0">
          {!artistId ? (
            <Link to={`/songs/${song?.key}`}>
              <p className="text-xl font-bold text-white truncate">{title}</p>
            </Link>
          ) : (
            <p className="text-xl font-bold text-white truncate">{title}</p>
          )}
          <p className="text-base text-gray-300 mt-1 truncate">{caption}</p>
        </div>
      </div>
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={() => handlePlayClick(song, i)}
      />
    </div>
  );
};

export default SongBar;
