import axios from 'axios'
import { api } from '#/lib/axios'
import type { PhotoResponse } from '#/types/api'

/** Formatos de imagem aceitos pela API */
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
/** Tamanho máximo de arquivo: 2 MB */
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024
/** Limite de fotos por ponto turístico */
const MAX_PHOTOS_PER_SPOT = 4

/**
 * Valida o arquivo de imagem no client antes do upload.
 * Lança um erro descritivo se o arquivo não atender aos critérios.
 */
function validatePhotoFile(file: File): void {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      'Formato de imagem inválido. Use JPEG, PNG ou WebP.',
    )
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      'O arquivo excede o tamanho máximo de 2 MB.',
    )
  }
}

export const photosService = {
  /**
   * POST /photos/tourist-points/{id}
   * Upload de foto para um ponto turístico via multipart/form-data.
   * Requer autenticação (apenas o dono).
   *
   * ⚠️ O OpenAPI declara application/json incorretamente — implementado
   * como multipart/form-data conforme comportamento real de MultipartFile do Spring.
   *
   * Valida client-side: formato (JPEG/PNG/WebP), tamanho máximo 2MB,
   * limite de 4 fotos por ponto.
   */
  uploadPhoto: async (
    touristPointId: string,
    file: File,
    currentPhotoCount: number,
  ): Promise<PhotoResponse> => {
    // Validação client-side antes de bater na API
    if (currentPhotoCount >= MAX_PHOTOS_PER_SPOT) {
      throw new Error(
        `Limite de ${MAX_PHOTOS_PER_SPOT} fotos por ponto atingido.`,
      )
    }
    validatePhotoFile(file)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await api.post<PhotoResponse>(
        `/photos/tourist-points/${touristPointId}`,
        formData,
        // Não setar Content-Type manualmente — o axios/browser define o boundary correto
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400) {
          const message =
            (err.response?.data as { message?: string } | undefined)
              ?.message ??
            'Arquivo inválido, tamanho excedido ou limite de fotos atingido.'
          throw new Error(message)
        }
        if (status === 401) {
          throw new Error('Você precisa estar logado para enviar fotos.')
        }
        if (status === 403) {
          throw new Error(
            'Você não tem permissão para adicionar fotos a este ponto.',
          )
        }
        if (status === 404) {
          throw new Error('Ponto turístico não encontrado.')
        }
        if (status === 500) {
          throw new Error(
            'Falha ao salvar a foto no servidor. Tente novamente.',
          )
        }
      }
      throw new Error('Erro ao enviar a foto. Tente novamente.')
    }
  },

  /**
   * DELETE /photos/{id}
   * Remove uma foto pelo ID da foto (não do ponto turístico).
   * Requer autenticação (apenas o dono).
   *
   * ⚠️ Este endpoint retorna 201 em caso de sucesso (não o esperado 204).
   * Isso é tratado aqui: qualquer status 2xx é considerado sucesso.
   */
  deletePhoto: async (photoId: string): Promise<void> => {
    try {
      // validateStatus aceita 201 e 204 como sucesso
      await api.delete(`/photos/${photoId}`, {
        validateStatus: (status) => status === 201 || status === 204,
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401) {
          throw new Error('Você precisa estar logado para remover fotos.')
        }
        if (status === 403) {
          throw new Error('Você não tem permissão para remover esta foto.')
        }
        if (status === 404) {
          throw new Error('Foto ou ponto turístico não encontrado.')
        }
        if (status === 500) {
          throw new Error(
            'Falha ao remover a foto do servidor. Tente novamente.',
          )
        }
      }
      throw new Error('Erro ao remover a foto. Tente novamente.')
    }
  },
}
