import { storage } from '#/lib/storage'
/**
 * Serviço mockado para favoritos, já que a API real não possui endpoints.
 * Simula um delay de rede usando localStorage para persistência local do estado.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getFavoritesKey = (userId: string) => `tur_favorites_${userId}`

export const getStoredFavorites = (userId: string): string[] => {
  try {
    const data = storage.getItem(getFavoritesKey(userId))
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveStoredFavorites = (userId: string, favorites: string[]) => {
  storage.setItem(getFavoritesKey(userId), JSON.stringify(favorites))
}

export const favoritesService = {
  /** GET /favorites/check/{spotId} (Mock) */
  checkFavoriteStatus: async (spotId: string, userId: string): Promise<{ isFavorite: boolean }> => {
    await delay(300) // Simula delay da rede
    const favorites = getStoredFavorites(userId)
    return { isFavorite: favorites.includes(spotId) }
  },

  /** POST /favorites/{spotId} (Mock) */
  addFavorite: async (spotId: string, userId: string): Promise<void> => {
    await delay(400)
    const favorites = getStoredFavorites(userId)
    if (!favorites.includes(spotId)) {
      favorites.push(spotId)
      saveStoredFavorites(userId, favorites)
    }
  },

  /** DELETE /favorites/{spotId} (Mock) */
  removeFavorite: async (spotId: string, userId: string): Promise<void> => {
    await delay(400)
    const favorites = getStoredFavorites(userId)
    const newFavorites = favorites.filter(id => id !== spotId)
    saveStoredFavorites(userId, newFavorites)
  }
}
