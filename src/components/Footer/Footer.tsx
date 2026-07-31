import React, { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const navSections = [
    {
      title: 'EXPLORAR',
      links: [
        { label: 'Explorar', href: '#' },
        { label: 'Categorias', href: '#' },
        { label: 'Estados', href: '#' },
      ],
    },
    {
      title: 'COMUNIDADE',
      links: [
        { label: 'Favoritos', href: '#' },
        { label: 'Comunidade', href: '#' },
        { label: 'Cadastrar um ponto', href: '#' },
      ],
    },
    {
      title: 'PROJETO',
      links: [
        { label: 'Sobre', href: '#' },
        { label: 'GitHub', href: 'https://github.com', external: true },
        { label: 'Contato', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: '#',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#111111] text-white border-t border-[#333333] pt-16 md:pt-24 pb-12 px-6 md:px-12 lg:px-24 font-inter">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-16">
        
        {/* Lado Esquerdo */}
        <div className="flex-1 lg:w-5/12 flex flex-col justify-between items-center lg:items-start gap-12">
          {/* Imagem do Ícone Centralizada e Inclinada */}
          <div className="w-full flex-1 flex items-center justify-center py-6">
            <img
              src="/assets/images/icone-footer.png"
              alt="Tur. Icon"
              className="w-44 sm:w-52 md:w-60 h-auto object-contain -rotate-6 transition-transform duration-500 ease-out hover:rotate-0 hover:scale-105"
            />
          </div>

          {/* Logo Maior no Canto Inferior Esquerdo */}
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="font-dm-sans text-4xl sm:text-5xl font-bold tracking-tight text-white">tur</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#DF4927]"></span>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="flex-1 lg:w-7/12 w-full flex flex-col justify-between lg:border-l border-[#333333] lg:pl-12 gap-10">
          
          {/* Destaques Superiores em Tamanho Levemente Menor com Linha Divisória */}
          <div className="flex flex-col pb-6 border-b border-[#333333]">
            <h2 className="font-dm-sans text-2xl sm:text-3xl md:text-[32px] font-bold text-white tracking-tight leading-tight pb-4 border-b border-[#333333]">
              Projeto Open Source
            </h2>
            <h2 className="font-dm-sans text-2xl sm:text-3xl md:text-[32px] font-bold text-white tracking-tight leading-tight pt-4">
              Website by Mendes
            </h2>
          </div>

          {/* Colunas de Links do Projeto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-[#333333]">
            {navSections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <h3 className="text-xs font-bold tracking-[2px] uppercase text-[#888888] font-inter">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-sm font-medium text-white hover:text-[#DF4927] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Seção de Newsletter e Redes Sociais */}
          <div className="flex flex-col gap-6">
            
            {/* Newsletter Input (Altura casada com a dos ícones de rede social: h-13 sm:h-14) */}
            <div className="flex flex-col gap-3">
              <label htmlFor="newsletter-email" className="text-xs font-bold tracking-[2px] uppercase text-[#888888]">
                NÃO PERCA NADA
              </label>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="SEU E-MAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-13 sm:h-14 bg-[#1A1A1A] border border-[#333333] px-4 text-xs tracking-wider text-white placeholder-[#888888] focus:outline-none focus:border-[#DF4927] transition-colors uppercase font-mono"
                />
                <button
                  type="submit"
                  className="h-13 sm:h-14 bg-white text-[#111111] hover:bg-[#DF4927] hover:text-white px-6 text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer shrink-0 font-inter flex items-center justify-center"
                >
                  {subscribed ? 'INSCRITO ✓' : 'ASSINAR'}
                </button>
              </form>
            </div>

            {/* Grid de Ícones das Redes Sociais (Hover Laranja com Ícone Branco) */}
            <div className="flex items-center gap-0 border-t border-[#333333] pt-6">
              {socialLinks.map((social, sIdx) => (
                <a
                  key={sIdx}
                  href={social.href}
                  aria-label={social.name}
                  className="w-13 h-13 sm:w-14 sm:h-14 border border-[#333333] flex items-center justify-center text-[#888888] hover:bg-[#DF4927] hover:text-white hover:border-[#DF4927] transition-all duration-200 -mr-[1px]"
                >
                  {social.icon}
                </a>
              ))}
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
