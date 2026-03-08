import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative mb-8">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Поиск фильмов..."
          className="w-full pl-12 pr-24 py-3 bg-card-bg border border-gray-700 
                     rounded-lg text-white placeholder-gray-500
                     focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                     transition-colors"
          autoFocus
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                       text-gray-400 hover:text-white transition-colors"
            aria-label="Очистить поиск"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(SearchBar);
