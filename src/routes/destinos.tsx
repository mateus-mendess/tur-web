import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/destinos')({
  component: DestinosPage,
})

function DestinosPage() {
  return (
    <div className="min-h-screen bg-background pt-32 px-10 text-primary">
      <h1 className="text-4xl font-bold">Destinos</h1>
      <p className="mt-4 text-lg">Página em desenvolvimento...</p>
    </div>
  )
}
