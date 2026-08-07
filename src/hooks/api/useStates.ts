import { useQuery } from '@tanstack/react-query'
import { statesService } from '#/services/statesService'

export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: statesService.getStates,
    // Estados do Brasil são dados imutáveis — nunca ficam stale
    staleTime: Infinity,
  })
}
