import { useState } from 'react'

export function useSpotDetailModals() {
  const [isEditSpotOpen, setIsEditSpotOpen] = useState(false)
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false)
  const [isUploadPhotosOpen, setIsUploadPhotosOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return {
    isEditSpotOpen,
    setIsEditSpotOpen,
    isEditAddressOpen,
    setIsEditAddressOpen,
    isUploadPhotosOpen,
    setIsUploadPhotosOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  }
}
