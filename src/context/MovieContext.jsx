import { createContext, useState, useContext, useEffect } from 'react';

// 1. Creación del objeto Contexto para compartir el estado de favoritos globalmente
const MovieContext = createContext();

/**
 * Hook personalizado (Custom Hook) para consumir fácilmente el contexto desde cualquier componente.
 */
export const useMovieContext = () => useContext(MovieContext);

/**
 * Componente Proveedor que envuelve la aplicación y gestiona la persistencia de datos.
 */
export const MovieProvider = ({ children }) => {
  // Inicialización perezosa del estado (Lazy Initialization):
  // La función dentro de useState solo se ejecuta una vez al montar el componente, leyendo localStorage.
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Efecto Secundario: Se dispara cada vez que el estado 'favorites' cambia para sincronizar con localStorage.
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Añade una película manteniendo la inmutabilidad de React (operador Spread [...prev])
  const addToFavorites = (movie) => {
    setFavorites(prev => [...prev, movie]);
  };

  // Elimina una película filtrando por ID (devuelve una nueva lista sin mutar el array original)
  const removeFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  // Comprueba si una película concreta ya forma parte de los favoritos
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  // Objeto con los valores y métodos expuestos a través del Contexto
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};