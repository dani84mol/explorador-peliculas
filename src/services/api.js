// Clave de API privada y URL base del servicio REST de The Movie Database (TMDb)
const API_KEY = 'd2183cc8139f89123fb5b672f4a4cc29';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Obtiene la lista oficial de géneros cinematográficos en español desde TMDb.
 * @returns {Promise<Array>} Lista de objetos género { id, name }
 */
export const getGenres = async () => {
  // Petición HTTP asíncrona mediante la API Fetch nativa de JS
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
  const data = await response.json();
  return data.genres || [];
};

/**
 * Consulta el catálogo de películas aplicando filtros de género, criterio de ordenación y número de página.
 * @param {Object} options - Opciones de filtrado y paginación
 * @returns {Promise<Object>} Objeto con las películas encontradas y el total de páginas
 */
export const getFilteredMovies = async ({ genreId = '', sortBy = 'popularity.desc', page = 1 } = {}) => {
  // Construcción dinámica de la URL con parámetros Query String
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=${sortBy}&page=${page}`;
  
  // Si el usuario seleccionó un género específico, añadimos la categoría al endpoint
  if (genreId) {
    url += `&with_genres=${genreId}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  
  return {
    results: data.results || [],
    // TMDb limita técnicamente las búsquedas públicas a un máximo de 500 páginas
    totalPages: Math.min(data.total_pages || 1, 500),
  };
};

/**
 * Realiza una búsqueda por coincidencia de texto en el título de la película.
 * @param {string} query - Texto introducido por el usuario
 * @param {number} page - Número de página actual
 */
export const searchMovies = async (query, page = 1) => {
  // encodeURIComponent escapa caracteres especiales o espacios para evitar URLs inválidas
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES&page=${page}`
  );
  const data = await response.json();
  
  return {
    results: data.results || [],
    totalPages: Math.min(data.total_pages || 1, 500),
  };
};