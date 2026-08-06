import { BaseModal } from '#/components/UI/BaseModal'
import { CreateSpotForm } from './CreateSpotForm'
import type { SpotFormData } from '#/schemas/spotSchema'

export interface CreateSpotModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: SpotFormData) => void
}

export function CreateSpotModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSpotModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Criar Ponto Turístico"
    >
      <CreateSpotForm onSuccess={onSuccess} onCancel={onClose} />
    </BaseModal>
  )
}
