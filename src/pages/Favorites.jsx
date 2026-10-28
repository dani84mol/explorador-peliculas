import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  // Acceso a la lista global de películas guardadas
  const { favorites } = useMovieContext();

  // Estado vacío: Renderizado condicional si no hay favoritos guardados
  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No tienes películas favoritas</h2>
        <p>Agrega películas a tus favoritos desde la página principal para verlas aquí.</p>
      </div>
    );
  }

  // Si hay elementos, renderiza la lista de películas reutilizando MovieCard
  return (
    <div className="favorites">
      <h2>Tus Películas Favoritas</h2>
      <div className="movies-grid">
        {favorites.map((movie) => (
          // Asignación obligatoria de la prop 'key' única para la optimización de listas en React
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}