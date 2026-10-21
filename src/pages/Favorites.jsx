import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No tienes películas favoritas</h2>
        <p>Agrega películas a tus favoritos desde la página principal para verlas aquí.</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Tus Películas Favoritas</h2>
      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}