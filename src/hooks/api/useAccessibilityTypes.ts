import { useQuery } from '@tanstack/react-query'
import { accessibilityService } from '#/services/accessibilityService'
import { queryKeys } from '#/lib/queryKeys'

export function useAccessibilityTypes() {
  return useQuery({
    queryKey: queryKeys.accessibilityTypes,
    queryFn: accessibilityService.getAccessibilityTypes,
    // Tipos de acessibilidade são dados estáticos — nunca ficam stale
    staleTime: Infinity,
  })
}
