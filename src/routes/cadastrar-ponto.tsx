import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateSpotModal } from '../components/Spots/CreateSpotModal'
import type { SpotFormData } from '../schemas/spotSchema'
import { Header } from '../components/Header/Header'

export const Route = createFileRoute('/cadastrar-ponto')({
  component: CadastrarPontoPage,
})

function CadastrarPontoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submittedData, setSubmittedData] = useState<SpotFormData | null>(null)

  return (
    <div className="min-h-screen bg-tur-bg pb-20 px-6 md:px-12 py-6">
      <Header theme="light" />

      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="font-dm-sans text-3xl md:text-5xl font-bold text-tur-dark mb-4">
          Cadastro de Ponto Turístico
        </h1>
        <p className="font-inter text-tur-gray-600 mb-8">
          Esta é a página de pré-visualização do modal para cadastrar pontos
          turísticos.
        </p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-tur-dark text-white px-6 py-3 font-dm-sans font-semibold hover:bg-tur-dark-hover transition-colors cursor-pointer"
        >
          Abrir Modal de Cadastro
        </button>

        {submittedData && (
          <div className="mt-8 p-6 bg-white border border-black/20 shadow-md">
            <h3 className="font-dm-sans text-xl font-bold mb-2 text-tur-dark">
              Ponto Turístico Cadastrado!
            </h3>
            <pre className="font-mono text-xs bg-gray-100 p-4 overflow-x-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <CreateSpotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(data) => {
          setSubmittedData(data)
          alert(`Ponto turístico "${data.nome}" cadastrado com sucesso!`)
        }}
      />
    </div>
  )
}
