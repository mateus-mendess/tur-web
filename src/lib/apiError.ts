import axios from 'axios'

/**
 * Helper para centralizar o tratamento de erros HTTP usando Axios.
 * Ele tenta extrair a propriedade 'message' do corpo da resposta, se existir.
 * Caso contrário, usa as mensagens definidas em 'statusMessages' (chave: statusCode, valor: mensagem).
 * Por fim, usa 'fallbackMessage' se o status não estiver mapeado ou não for erro do Axios.
 */
export function handleApiError(
  err: unknown,
  statusMessages: Record<number, string>,
  fallbackMessage: string
): never {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status

    // Se o backend retornou explicitamente uma mensagem (comum em 400 Bad Request)
    const backendMessage = (err.response?.data as { message?: string } | undefined)?.message

    if (status !== undefined) {
      if (backendMessage && status === 400) {
        throw new Error(backendMessage)
      }
      
      const customMessage = statusMessages[status]
      if (customMessage) {
        throw new Error(customMessage)
      }
    }
  }

  throw new Error(fallbackMessage)
}
