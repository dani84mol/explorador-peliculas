const API_KEY = 'd2183cc8139f89123fb5b672f4a4cc29';
const BASE_URL = 'https://api.themoviedb.org/3';

// Obtener la lista oficial de géneros en español
export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
  const data = await response.json();
  return data.genres || [];
};

// Descubrir películas con filtros de género, orden y página
export const getFilteredMovies = async ({ genreId = '', sortBy = 'popularity.desc', page = 1 } = {}) => {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=${sortBy}&page=${page}`;
  
  if (genreId) {
    url += `&with_genres=${genreId}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  return {
    results: data.results || [],
    totalPages: Math.min(data.total_pages || 1, 500),
  };
};

export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES&page=${page}`
  );
  const data = await response.json();
  return {
    results: data.results || [],
    totalPages: Math.min(data.total_pages || 1, 500),
  };
};