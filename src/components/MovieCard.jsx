import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Film } from "lucide-react";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const movieRating =
    movie?.rating?.imdb || movie?.rating?.kp || movie?.ratingKinopoisk || 0;

  const getRatingColor = (rating) => {
    if (rating >= 7) return "bg-green-600";
    if (rating >= 5) return "bg-yellow-500";
    return "bg-red-600";
  };

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-card-bg rounded-lg overflow-hidden 
                 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,85,0,0.5)] 
                 hover:scale-105 hover:z-10 cursor-pointer"
    >
      <div className="aspect-2/3 relative">
        {movie?.poster?.url ? (
          <img
            src={movie.poster.url}
            alt={movie.name || "Постер фильма"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Film size={48} className="text-gray-600" />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3
          className="font-semibold text-sm mb-1 line-clamp-1"
          title={movie.name}
        >
          {movie.name || "Без названия"}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{movie.year || "N/A"}</span>

          {movieRating > 0 && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded ${getRatingColor(movieRating)}`}
            >
              <Star size={12} className="text-white fill-current" />
              <span className="font-bold text-white">
                {movieRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
