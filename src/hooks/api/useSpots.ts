import { useQuery } from '@tanstack/react-query'
import { spotsService } from '../../services/spotsService'

export function useSpots() {
  return useQuery({
    queryKey: ['spots'],
    queryFn: spotsService.getSpots,
  })
}
