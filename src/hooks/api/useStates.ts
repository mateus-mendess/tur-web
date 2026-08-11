import { useQuery } from '@tanstack/react-query'
import { statesService } from '#/services/statesService'
import { queryKeys } from '#/lib/queryKeys'

export function useStates() {
  return useQuery({
    queryKey: queryKeys.states,
    queryFn: statesService.getStates,
    // Estados do Brasil são dados imutáveis — nunca ficam stale
    staleTime: Infinity,
  })
}
