import axios from 'axios'
import { api } from '#/lib/axios'
import type { CommentResponse, CommentRequest } from '#/types/api'
import { storage, TOKEN_STORAGE_KEY } from '#/lib/storage'

export const commentsService = {
  /**
   * GET /tourist-points/{touristPointId}/comments
   * Lista todos os comentários de um ponto. Não requer autenticação.
   */
  getComments: async (touristPointId: string): Promise<CommentResponse[]> => {
    if (touristPointId.startsWith('mock-')) {
      return [
        {
          authorName: 'Maria Silva',
          note: 5,
          content: 'Lugar incrível! A vista é de tirar o fôlego e a infraestrutura do parque melhorou muito nos últimos anos. Recomendo chegar cedo para evitar as filas e aproveitar a luz do sol nascendo, é uma experiência única que você não vai querer perder.',
        },
        {
          authorName: 'João Souza',
          note: 4,
          content: 'Gostei bastante, mas achei o acesso um pouco difícil para quem vai de transporte público.',
        },
        {
          authorName: 'Ana Clara',
          note: 5,
          content: 'Tudo perfeito. Comida ótima nas redondezas.',
        },
        {
          authorName: 'Carlos Eduardo',
          note: 3,
          content: 'Bom, mas muito cheio aos finais de semana. A fila para o estacionamento estava gigante e o atendimento nas lojas locais deixou a desejar um pouco. Se você busca paz e tranquilidade, talvez não seja o melhor momento para visitar.',
        },
        {
          authorName: 'Beatriz Moura',
          note: 4,
          content: 'Vale a pena conhecer. Leve bastante água!',
        },
        {
          authorName: 'Rafael Gomes',
          note: 5,
          content: 'Um dos melhores lugares que já visitei. Com certeza voltarei com a minha família no próximo ano para explorar as trilhas que não tivemos tempo de fazer desta vez.',
        },
        {
          authorName: 'Patrícia Lima',
          note: 4,
          content: 'Muito bonito, boas opções de fotos.',
        },
        {
          authorName: 'Diego Fernandes',
          note: 2,
          content: 'Achei que estava meio abandonado, precisa de mais cuidado da prefeitura.',
        },
        {
          authorName: 'Mariana Costa',
          note: 5,
          content: 'Simplesmente mágico! Uma verdadeira conexão com a natureza e um respiro de ar puro no meio da semana corrida. Não vejo a hora de poder voltar.',
        },
        {
          authorName: 'Lucas Almeida',
          note: 4,
          content: 'Boa experiência geral. Preços um pouco salgados, mas a vista compensa o valor investido.',
        },
      ];
    }

    const { data } = await api.get<CommentResponse[]>(
      `/tourist-points/${touristPointId}/comments`,
    )
    return data
  },

  /**
   * POST /tourist-points/{touristPointId}/comments
   * Submete um comentário com nota (1–5).
   *
   * ⚠️ Inconsistência no contrato (seção 10, item 2):
   * - Descrição textual: não requer autenticação
   * - Schema OpenAPI: define security bearerAuth
   *
   * Implementado para enviar o token SE disponível (via header),
   * sem forçar autenticação. Se a API retornar 401 mesmo com token,
   * o erro é propagado para ajuste futuro.
   */
  createComment: async (
    touristPointId: string,
    comment: CommentRequest,
  ): Promise<void> => {
    try {
      // Verifica se há token disponível para enviar (sem forçar)
      const token = storage.getItem(TOKEN_STORAGE_KEY)
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      await api.post(
        `/tourist-points/${touristPointId}/comments`,
        comment,
        { headers },
      )
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400) {
          const message =
            (err.response?.data as { message?: string } | undefined)
              ?.message ?? 'Dados do comentário inválidos.'
          throw new Error(message)
        }
        if (status === 401) {
          throw new Error(
            'Você precisa estar logado para comentar.',
          )
        }
        if (status === 404) {
          throw new Error('Ponto turístico não encontrado.')
        }
      }
      throw new Error('Erro ao enviar o comentário. Tente novamente.')
    }
  },
}
