import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getFilteredMovies, searchMovies, getGenres } from '../services/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [movies, setMovies] = useState([]);
  
  // Estados para filtros y orden
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  
  // Paginación y control de carga
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar lista de géneros al montar el componente
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

  // Cargar películas según búsqueda o filtros activos
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        if (activeQuery.trim()) {
          data = await searchMovies(activeQuery, page);
        } else {
          data = await getFilteredMovies({ genreId: selectedGenre, sortBy, page });
        }
        setMovies(data.results);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        setError('Error al obtener el catálogo de películas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, activeQuery, selectedGenre, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveQuery(searchQuery.trim());
    setSelectedGenre(''); // Limpia género al buscar por texto
    setPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setActiveQuery(''); // Vuelve al modo filtros al elegir género
    setSearchQuery('');
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="home">
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

      {/* Barra de Filtros */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="genre-select">Género:</label>
          <select
            id="genre-select"
            className="filter-select"
            value={selectedGenre}
            onChange={handleGenreChange}
            disabled={Boolean(activeQuery)}
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
              {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          )}

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