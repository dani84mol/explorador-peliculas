import { useMovieContext } from '../context/MovieContext';

export default function MovieCard({ movie }) {
  // Consumo del estado global de favoritos desde el Custom Hook del Contexto
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  // Manejador del clic en el botón de favoritos
  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Construcción de la URL de la imagen de póster de TMDb o fallback en caso de no existir
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sin+Imagen';

  // Extracción del año a partir del formato de fecha ISO 'YYYY-MM-DD'
  const releaseYear = movie.release_date
    ? movie.release_date.split('-')[0]
    : 'Desconocido';

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {/* Atributo loading="lazy" para optimizar el rendimiento de la carga diferida de imágenes */}
        <img src={posterUrl} alt={movie.title} loading="lazy" />
        <div className="movie-overlay">
          <button
            type="button"
            className={`favorite-btn ${favorite ? 'active' : ''}`}
            onClick={onFavoriteClick}
            aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <svg
              viewBox="0 0 24 24"
              fill={favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{releaseYear}</p>
      </div>
    </div>
  );
}