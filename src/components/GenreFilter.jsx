import React, { useState, useEffect } from "react";
import { kinopoiskAPI } from "@/services/api";

const GenreFilter = ({ selectedGenre, onGenreChange }) => {
  const [genres, setGenres] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      const data = await kinopoiskAPI.getGenres();
      setGenres(data || []);
    };
    loadGenres();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-card-bg text-white rounded-lg border border-gray-700 
                   hover:border-primary transition-colors flex items-center justify-between gap-2"
      >
        <span className="truncate">
          {selectedGenre
            ? genres.find((g) => g.id === Number(selectedGenre))?.genre ||
              "Жанр"
            : "Все жанры"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-card-bg border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              onGenreChange("");
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 first:rounded-t-lg"
          >
            Все жанры
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                onGenreChange(genre.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
              {genre.genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreFilter;
