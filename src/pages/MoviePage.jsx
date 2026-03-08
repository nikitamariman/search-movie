import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { kinopoiskAPI } from "@/services/api";
import { ArrowLeft, Star, Film } from "lucide-react";

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const data = await kinopoiskAPI.getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-2">Ошибка загрузки</h2>
          <p className="text-gray-400">{error || "Фильм не найден"}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const rating = movie.rating?.imdb || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Назад
        </button>

        <div className="bg-card-bg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 lg:w-1/4">
              {movie.poster?.url ? (
                <img
                  src={movie.poster.url}
                  alt={movie.name}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-2/3 flex items-center justify-center bg-gray-800">
                  <Film size={64} className="text-gray-600" />
                </div>
              )}
            </div>

            <div className="p-6 md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl font-bold text-white mb-2">
                {movie.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-400">{movie.year} год</span>
                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-white font-semibold">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {movie.description && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Описание
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}

              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Жанры
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        {genre.genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.videos && movie.videos.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      Трейлеры
                    </h3>
                    {movie.videos.length > 3 && (
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-primary hover:underline text-sm"
                      >
                        {showAll
                          ? "Скрыть"
                          : `Показать все (${movie.videos.length})`}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {movie.videos
                      .slice(0, showAll ? undefined : 3)
                      .map((video, index) => (
                        <a
                          key={index}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-primary hover:underline">
                              {video.name || "Смотреть трейлер"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {video.site}
                            </span>
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
