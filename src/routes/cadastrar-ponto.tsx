import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateSpotModal } from '#/components/Spots/CreateSpotModal'
import { Header } from '#/components/Header/Header'

export const Route = createFileRoute('/cadastrar-ponto')({
  component: CadastrarPontoPage,
  head: () => ({
    meta: [{ title: 'Cadastrar Ponto | Tur.' }],
  }),
})

function CadastrarPontoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-tur-bg pb-20 px-6 md:px-12 py-6">
      <Header theme="light" />

      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="font-dm-sans text-3xl md:text-5xl font-bold text-tur-dark mb-4">
          Cadastro de Ponto Turístico
        </h1>
        <p className="font-inter text-tur-gray-600 mb-8">
          Contribua com a comunidade compartilhando pontos turísticos que você
          conhece e recomenda. Seu cadastro passará por revisão antes de ser
          publicado.
        </p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-tur-dark text-white px-6 py-3 font-dm-sans font-semibold hover:bg-tur-dark-hover transition-colors cursor-pointer"
        >
          Cadastrar Ponto Turístico
        </button>
      </div>

      <CreateSpotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
