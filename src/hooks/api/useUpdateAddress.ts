import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addressService } from '#/services/addressService'
import type { AddressRequest } from '#/types/api'

export function useUpdateAddress(touristPointId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (address: AddressRequest) =>
      addressService.updateAddress(touristPointId, address),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['spots', touristPointId],
      })
      toast.success('Endereço atualizado com sucesso!')
    },
    onError: (error: Error) => {
      // 503 tem mensagem específica sobre geocoding — propagar diretamente
      toast.error(error.message)
    },
  })
}
