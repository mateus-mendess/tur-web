import { HeadContent, Scripts, createRootRoute, useLocation, useMatches } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'

import appCss from '#/styles.css?url'
import { queryClient } from '#/lib/queryClient'
import { AuthProvider, useAuth } from '#/contexts/AuthContext'
import { LoginModal } from '#/components/Auth/LoginModal'
import { SignUpModal } from '#/components/Auth/SignUpModal'
import { CreateSpotModal } from '#/components/Spots/CreateSpotModal'
import { NavBar } from '#/components/NavBar/NavBar'
import { Footer } from '#/components/Footer/Footer'

import { NotFoundPage } from '#/components/Pages/NotFoundPage'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Tur. | Descubra o Brasil',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFoundPage />,
})

function AppModals() {
  const { isLoginOpen, isSignUpOpen, isCreateSpotOpen, closeModals, handleLogin, handleSignUp, openLogin, openSignUp } = useAuth()
  
  return (
    <>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeModals} 
        onLogin={handleLogin}
        onSwitchToSignUp={openSignUp}
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={closeModals} 
        onSignUp={handleSignUp}
        onSwitchToLogin={openLogin}
      />
      <CreateSpotModal
        isOpen={isCreateSpotOpen}
        onClose={closeModals}
        onSuccess={closeModals}
      />
    </>
  )
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = useLocation({ select: (loc) => loc.pathname })
  
  return (
    <main key={pathname} className="page-transition-enter flex-1 flex flex-col">
      {children}
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const matches = useMatches()
  // No TanStack Router, quando uma rota não é encontrada, o array de matches
  // contém apenas a rota raiz (length === 1). Se alguma rota for encontrada
  // (mesmo a index), length será > 1.
  const isNotFound = matches.length === 1

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavBar />
            <PageWrapper>
              {children}
            </PageWrapper>
            {!isNotFound && <Footer />}
            <AppModals />
          </AuthProvider>
        </QueryClientProvider>
        <Toaster richColors position="top-right" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
