import { Link } from '@tanstack/react-router'
import { PageContainer } from '#/components/UI/PageContainer'

export function Footer() {
  const navSections = [
    {
      title: 'EXPLORAR',
      links: [
        { label: 'Explorar', href: '/explorar' },
        { label: 'Categorias', href: '/categorias' },
        { label: 'Estados', href: '/estados' },
      ],
    },
    {
      title: 'COMUNIDADE',
      links: [
        { label: 'Favoritos', href: '/favoritos' },
        { label: 'Comunidade', href: '/comunidade' },
        { label: 'Cadastrar um ponto', href: '/cadastrar' },
      ],
    },
    {
      title: 'PROJETO',
      links: [
        { label: 'Sobre', href: '/sobre' },
        { label: 'GitHub', href: 'https://github.com', external: true },
        { label: 'Contato', href: '/contato' },
      ],
    },
  ]



  return (
    <footer className="bg-background text-primary pt-20 pb-10 font-sans border-t border-primary/20">
      <PageContainer className="flex flex-col gap-20">
        
        {/* Main Content: Left and Right Columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col items-start gap-8 lg:w-4/12">
            {/* Logo */}
            <Link to="/" className="text-4xl font-normal tracking-tight hover:opacity-80 transition-opacity flex items-baseline">
              tur<span className="text-secondary">.</span>
            </Link>

            {/* Tagline */}
            <p className="text-sm md:text-base text-primary/60 font-normal leading-relaxed max-w-sm">
              Uma plataforma colaborativa para descobrir, salvar e
              compartilhar destinos fora do óbvio.
            </p>

            {/* Image Footer */}
            <div className="mt-4">
              <img 
                src="/assets/images/image_footer.png" 
                alt="Tur Footer Boarding" 
                className="h-15 w-auto object-contain" 
              />
            </div>
          </div>

          {/* Right Columns (Links) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24 lg:w-7/12">
            {navSections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-6">
                <h3 className="text-xs font-semibold tracking-[2px] uppercase text-primary/50">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-normal text-primary/70 hover:opacity-70 transition-opacity"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href as any}
                          className="text-sm font-normal text-primary/70 hover:opacity-70 transition-opacity"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Dotted Divider & Bottom Bar */}
        <div className="flex flex-col gap-8">
          <div className="w-full border-t border-dashed border-primary/20" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-primary/50">
            {/* Copyright */}
            <span>© 2026 tur. Todos os direitos reservados.</span>



            {/* Credit */}
            <span>Projeto Open Source desenvolvido por Mateus Mendes.</span>
          </div>
        </div>

      </PageContainer>
    </footer>
  )
}
