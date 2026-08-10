/**
 * Utilitário leve para decodificar payloads de JWT sem dependências externas.
 * O formato de um JWT é: header.payload.signature
 */
export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    
    // Decodifica corretamente caracteres unicode em Base64 (ex: acentuação)
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Falha ao decodificar JWT:', error)
    return null
  }
}
