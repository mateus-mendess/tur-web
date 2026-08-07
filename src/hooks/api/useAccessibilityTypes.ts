import { useQuery } from '@tanstack/react-query'
import { accessibilityService } from '#/services/accessibilityService'

export function useAccessibilityTypes() {
  return useQuery({
    queryKey: ['accessibility-types'],
    queryFn: accessibilityService.getAccessibilityTypes,
    // Tipos de acessibilidade são dados estáticos — nunca ficam stale
    staleTime: Infinity,
  })
}
