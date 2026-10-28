import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getFilteredMovies, searchMovies, getGenres } from '../services/api';

export default function Home() {
  // Estados para controlar los formularios de entrada de texto
  const [searchQuery, setSearchQuery] = useState('');   // Valor en tiempo real del input
  const [activeQuery, setActiveQuery] = useState('');   // Búsqueda confirmada tras hacer submit
  const [movies, setMovies] = useState([]);             // Catálogo de películas devueltas por la API

  // Estados para filtros desplegables y orden
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  // Estados de control de interfaz, carga y paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // EFECTO 1: Carga la lista inicial de géneros una sola vez (array de dependencias vacío [])
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Error al cargar géneros:', err);
      }
    };
    loadGenres();
  }, []);

  // EFECTO 2: Petición principal de películas. Se reejecuta ante cambios de página, texto de búsqueda o filtros
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        // Si hay una búsqueda por texto activa, se prioriza el endpoint de búsqueda
        if (activeQuery.trim()) {
          data = await searchMovies(activeQuery, page);
        } else {
          // Si no, se hace uso de la consulta con filtros (género y ordenamiento)
          data = await getFilteredMovies({ genreId: selectedGenre, sortBy, page });
        }
        setMovies(data.results);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        setError('Error al obtener el catálogo de películas.');
      } finally {
        setLoading(false); // Garantiza quitar el indicador de carga tanto si fue exitoso como si falló
      }
    };

    fetchMovies();
    // Desplazamiento suave hacia arriba al cambiar de página o filtro
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, activeQuery, selectedGenre, sortBy]);

  // Manejador del envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault(); // Evita la recarga de página nativa del navegador
    setActiveQuery(searchQuery.trim());
    setSelectedGenre(''); // Limpia el género seleccionado para evitar conflictos en las consultas
    setPage(1); // Reinicia a la primera página de resultados
  };

  // Manejador del cambio de género
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setActiveQuery(''); // Abandona el modo de búsqueda por texto
    setSearchQuery('');
    setPage(1);
  };

  // Manejador del cambio de orden
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="home">
      {/* Formulario de búsqueda por texto */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar películas por título..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">Buscar</button>
      </form>

      {/* Barra de Filtros y Criterios de Ordenación */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="genre-select">Género:</label>
          <select
            id="genre-select"
            className="filter-select"
            value={selectedGenre}
            onChange={handleGenreChange}
            disabled={Boolean(activeQuery)} // Se deshabilita si hay una búsqueda por texto activa
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Ordenar por:</label>
          <select
            id="sort-select"
            className="filter-select"
            value={sortBy}
            onChange={handleSortChange}
            disabled={Boolean(activeQuery)}
          >
            <option value="popularity.desc">Más populares</option>
            <option value="vote_average.desc&vote_count.gte=200">Mejor valoradas</option>
            <option value="primary_release_date.desc">Más recientes</option>
            <option value="revenue.desc">Mayor recaudación</option>
          </select>
        </div>

        {/* Botón opcional para limpiar la búsqueda por texto activa */}
        {activeQuery && (
          <button
            type="button"
            className="filter-clear-btn"
            onClick={() => {
              setActiveQuery('');
              setSearchQuery('');
              setPage(1);
            }}
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Renderizado condicional según estados de Error, Carga o Resultados */}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Cargando películas...</div>
      ) : (
        <>
          {movies.length === 0 ? (
            <div className="favorites-empty">
              <h2>Sin resultados</h2>
              <p>No se encontraron películas con los criterios seleccionados.</p>
            </div>
          ) : (
            <div className="movies-grid">
              {/* Mapeo de la lista de películas a componentes MovieCard */}
              {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          )}

          {/* Control de Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                &larr; Anterior
              </button>
              <span className="pagination-info">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Siguiente &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}