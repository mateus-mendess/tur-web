import { useEffect, useState, useMemo, type FormEvent } from 'react';

export interface CreateSpotData {
  nome: string;
  descricao: string;
  categorias: string[];
  acessibilidades: string[];
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
}

export interface CreateSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: CreateSpotData) => void;
}

const INITIAL_CATEGORIES = [
  'Praias',
  'Ecoturismo',
  'Histórico',
  'Gastronomia',
  'Natureza',
  'Aventura',
  'Cultura',
];

const ACCESSIBILITY_OPTIONS = [
  'Acessível para PCD',
  'Rampa de acesso',
  'Audiodescrição',
  'Elevador adaptado',
  'Banheiro acessível',
  'Sinalização tátil',
];

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

interface FieldErrors {
  nome?: string;
  descricao?: string;
  categorias?: string;
  cep?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export function CreateSpotModal({ isOpen, onClose, onSuccess }: CreateSpotModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields State - Step 1: Informações Básicas
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  // Form Fields State - Step 2: Categorias e Acessibilidade
  const [categoriesOptions, setCategoriesOptions] = useState<string[]>(INITIAL_CATEGORIES);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [acessibilidades, setAcessibilidades] = useState<string[]>([]);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [accessSearchQuery, setAccessSearchQuery] = useState('');

  // Form Fields State - Step 3: Localização
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');
  const [isEstadoMenuOpen, setIsEstadoMenuOpen] = useState(false);

  // Field-specific Error State
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Filtered dropdown lists for Step 2
  const filteredCategoriesInMenu = useMemo(() => {
    if (!categorySearchQuery.trim()) return categoriesOptions;
    return categoriesOptions.filter((cat) =>
      cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categoriesOptions, categorySearchQuery]);

  const filteredAccessOptionsInMenu = useMemo(() => {
    if (!accessSearchQuery.trim()) return ACCESSIBILITY_OPTIONS;
    return ACCESSIBILITY_OPTIONS.filter((acc) =>
      acc.toLowerCase().includes(accessSearchQuery.toLowerCase())
    );
  }, [accessSearchQuery]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCategoria = (cat: string) => {
    setCategorias((prev) => {
      const next = prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat];
      if (next.length > 0) {
        setFieldErrors((errs) => ({ ...errs, categorias: undefined }));
      }
      return next;
    });
  };

  const handleAddCategory = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;

    if (!categoriesOptions.includes(trimmed)) {
      setCategoriesOptions((prev) => [...prev, trimmed]);
    }
    if (!categorias.includes(trimmed)) {
      setCategorias((prev) => [...prev, trimmed]);
      setFieldErrors((errs) => ({ ...errs, categorias: undefined }));
    }

    setNewCategoryInput('');
    setCategorySearchQuery('');
  };

  const toggleAcessibilidade = (acc: string) => {
    setAcessibilidades((prev) =>
      prev.includes(acc) ? prev.filter((item) => item !== acc) : [...prev, acc]
    );
  };

  const handleStep1Next = (e: FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {};

    if (!nome.trim()) {
      errors.nome = 'Por favor, digite o nome do ponto turístico.';
    }
    if (!descricao.trim()) {
      errors.descricao = 'Por favor, informe uma breve descrição.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStep(2);
  };

  const handleStep2Next = (e: FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {};

    if (categorias.length === 0) {
      errors.categorias = 'Por favor, selecione pelo menos uma categoria.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsCategoryMenuOpen(false);
    setIsAccessMenuOpen(false);
    setFieldErrors({});
    setStep(3);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {};

    if (!cep.trim()) {
      errors.cep = 'Por favor, informe o CEP.';
    }
    if (!rua.trim()) {
      errors.rua = 'Por favor, informe a rua / logradouro.';
    }
    if (!bairro.trim()) {
      errors.bairro = 'Por favor, informe o bairro.';
    }
    if (!cidade.trim()) {
      errors.cidade = 'Por favor, informe a cidade.';
    }
    if (!estado) {
      errors.estado = 'Por favor, selecione um estado.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const data: CreateSpotData = {
      nome,
      descricao,
      categorias,
      acessibilidades,
      cep,
      rua,
      bairro,
      cidade,
      estado,
      complemento,
    };

    if (onSuccess) {
      onSuccess(data);
    }
    onClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setFieldErrors({});
    setIsCategoryMenuOpen(false);
    setIsAccessMenuOpen(false);
    setIsEstadoMenuOpen(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[1000] flex items-center justify-center p-5 animate-fade-in"
      onClick={resetAndClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[920px] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon (X) - Sem fundo branco */}
        <button
          type="button"
          className="absolute -right-12 top-0 max-md:right-4 max-md:top-4 bg-transparent border-none p-0 flex items-center justify-center cursor-pointer text-white hover:text-tur-accent max-md:text-tur-dark transition-colors duration-200 z-10"
          onClick={resetAndClose}
          aria-label="Fechar modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[520px]">
          {/* COLUNA DA ESQUERDA (INSTRUÇÕES E PASSO A PASSO) */}
          <div className="relative bg-white p-[45px_40px] max-md:p-[32px_24px] flex flex-col justify-between after:content-[''] after:absolute after:right-0 after:top-[10%] after:bottom-[10%] after:w-px after:bg-black/20 max-md:after:hidden">
            <div>
              {/* Grand Step Number */}
              <div className="font-dm-sans text-[72px] font-extralight text-tur-gray-400/80 leading-none select-none tracking-tighter">
                {step === 1 ? '01' : step === 2 ? '02' : '03'}
              </div>

              {step === 1 && (
                <div>
                  <h3 className="font-dm-sans text-[26px] font-normal text-tur-dark tracking-[-0.5px] leading-[1.2] mt-4 mb-3">
                    Informações básicas
                  </h3>
                  <p className="font-inter text-[14px] text-tur-gray-600 leading-[1.6] mb-5">
                    Informe o nome e uma breve descrição detalhando as principais atrações do local.
                  </p>
                  <p className="font-inter text-[13px] text-tur-gray-500 leading-[1.5]">
                    Todos os campos com * são de preenchimento obrigatório.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-dm-sans text-[26px] font-normal text-tur-dark tracking-[-0.5px] leading-[1.2] mt-4 mb-3">
                    Escolha da categoria
                  </h3>
                  <p className="font-inter text-[14px] text-tur-gray-600 leading-[1.6] mb-5">
                    Selecione uma ou mais categorias e opções de acessibilidade presentes no local.
                  </p>
                  <p className="font-inter text-[13px] text-tur-gray-500 leading-[1.5]">
                    Obrigatório selecionar pelo menos uma categoria.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="font-dm-sans text-[26px] font-normal text-tur-dark tracking-[-0.5px] leading-[1.2] mt-4 mb-3">
                    Localização do ponto
                  </h3>
                  <p className="font-inter text-[14px] text-tur-gray-600 leading-[1.6] mb-5">
                    Informe o endereço completo para que os visitantes encontrem o ponto turístico.
                  </p>
                  <p className="font-inter text-[13px] text-tur-gray-500 leading-[1.5]">
                    Todos os campos com * são de preenchimento obrigatório.
                  </p>
                </div>
              )}
            </div>

            {/* Stepper Footer (3 etapas) */}
            <div className="mt-auto pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`} />
                <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`} />
                <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`} />
              </div>
              <span className="font-inter text-xs font-medium text-tur-gray-500">
                Etapa {step} de 3
              </span>
            </div>
          </div>

          {/* COLUNA DA DIREITA (FORMULÁRIO) */}
          <div className="relative bg-white p-[45px_40px_36px_40px] max-md:p-[32px_24px] flex flex-col justify-between">
            <div className="absolute top-6 right-8 max-md:hidden">
              <img src="/assets/images/selo-img.png" alt="Selo postal" className="w-[90px] h-auto object-contain drop-shadow-sm opacity-90 grayscale-[0.2]" />
            </div>

            {/* ETAPA 1: NOME E DESCRIÇÃO */}
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="flex flex-col gap-5 flex-1 justify-between mt-[115px] max-md:mt-6">
                <div className="flex flex-col gap-4">
                  {/* NOME DO PONTO */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="spot-nome" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                      Nome do ponto turístico <span className="text-tur-accent">*</span>
                    </label>
                    <input
                      id="spot-nome"
                      type="text"
                      className={`w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 ${
                        fieldErrors.nome ? 'border-tur-red' : 'border-tur-gray-300'
                      }`}
                      placeholder="Ex: Praia de Antunes"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (fieldErrors.nome) setFieldErrors((prev) => ({ ...prev, nome: undefined }));
                      }}
                    />
                    {fieldErrors.nome && (
                      <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                        {fieldErrors.nome}
                      </span>
                    )}
                  </div>

                  {/* DESCRIÇÃO */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="spot-descricao" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                      Descrição <span className="text-tur-accent">*</span>
                    </label>
                    <textarea
                      id="spot-descricao"
                      rows={3}
                      className={`w-full p-2.5 font-inter text-xs text-tur-dark bg-transparent border rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 resize-none ${
                        fieldErrors.descricao ? 'border-tur-red' : 'border-tur-gray-300'
                      }`}
                      placeholder="Descreva as atrações e características do local..."
                      value={descricao}
                      onChange={(e) => {
                        setDescricao(e.target.value);
                        if (fieldErrors.descricao) setFieldErrors((prev) => ({ ...prev, descricao: undefined }));
                      }}
                    />
                    {fieldErrors.descricao && (
                      <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                        {fieldErrors.descricao}
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTÃO PRÓXIMO */}
                <div className="flex justify-end mt-auto">
                  <button
                    type="submit"
                    className="h-11 px-8 bg-tur-dark text-white font-dm-sans text-[14px] font-semibold border-none rounded-none cursor-pointer tracking-[0.2px] flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-tur-dark-hover"
                  >
                    <span>Próximo</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 2: CATEGORIA E ACESSIBILIDADE */}
            {step === 2 && (
              <form onSubmit={handleStep2Next} className="flex flex-col gap-5 flex-1 justify-between mt-[90px] max-md:mt-6">
                <div className="flex flex-col gap-4">
                  {/* SELEÇÃO DE CATEGORIAS */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                      Categoria(s) <span className="text-tur-accent">*</span>
                    </label>
                    
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCategoryMenuOpen((prev) => !prev);
                          setIsAccessMenuOpen(false);
                        }}
                        className={`w-full font-inter text-xs px-3.5 py-2.5 rounded-none border bg-transparent text-tur-dark hover:border-black font-medium cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          fieldErrors.categorias ? 'border-tur-red' : 'border-black/30'
                        }`}
                      >
                        <span className="truncate">
                          {categorias.length > 0
                            ? `${categorias.length} categoria(s) selecionada(s)`
                            : 'Selecionar categorias...'}
                        </span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className={`transition-transform duration-200 shrink-0 ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>

                      {/* Backdrop */}
                      {isCategoryMenuOpen && (
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setIsCategoryMenuOpen(false)}
                        />
                      )}

                      {/* Dropdown Menu Popover */}
                      <div className={`absolute left-0 top-full mt-1 w-full bg-white border border-black shadow-2xl z-30 p-2.5 flex flex-col gap-1.5 rounded-none transition-all duration-200 ease-out transform origin-top-left ${
                        isCategoryMenuOpen 
                          ? 'opacity-100 translate-y-0 pointer-events-auto' 
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}>
                        {/* Search Input */}
                        <div className="relative w-full">
                          <input 
                            type="text" 
                            placeholder="Buscar categoria..." 
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            className="w-full font-inter text-xs border border-black/30 p-1.5 pr-7 rounded-none outline-none focus:border-black"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-1/2 -translate-y-1/2 text-tur-gray-500 pointer-events-none">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                          </svg>
                        </div>

                        {/* Options List */}
                        <div className="max-h-28 overflow-y-auto flex flex-col gap-0.5 pr-1">
                          {filteredCategoriesInMenu.map((cat) => {
                            const isSelected = categorias.includes(cat);
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => toggleCategoria(cat)}
                                className="text-left font-inter text-xs px-2 py-1 transition-colors flex items-center gap-2 rounded-none hover:bg-black/5 text-tur-dark cursor-pointer"
                              >
                                <span className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                                  isSelected
                                    ? 'bg-tur-accent'
                                    : 'border border-black/30 bg-transparent'
                                }`} />
                                <span className={isSelected ? 'font-semibold text-tur-accent' : 'font-normal text-tur-dark'}>{cat}</span>
                              </button>
                            );
                          })}

                          {filteredCategoriesInMenu.length === 0 && (
                            <div className="font-inter text-xs text-tur-gray-500 py-1.5 text-center">
                              Nenhuma categoria encontrada
                            </div>
                          )}
                        </div>

                        {/* Campo de Cadastrar Nova Categoria */}
                        <form onSubmit={handleAddCategory} className="border-t border-black/10 pt-2 flex items-center gap-1.5 mt-0.5">
                          <input 
                            type="text" 
                            placeholder="Nova categoria..." 
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            className="flex-1 font-inter text-xs border border-black/30 px-2 py-1 rounded-none outline-none focus:border-black"
                          />
                          <button 
                            type="button"
                            onClick={handleAddCategory}
                            title="Cadastrar nova categoria"
                            className="bg-black text-white px-2 py-1 border border-black font-bold hover:bg-tur-accent hover:border-tur-accent transition-colors cursor-pointer flex items-center justify-center rounded-none shrink-0"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"/>
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Error message under Categories */}
                    {fieldErrors.categorias && (
                      <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                        {fieldErrors.categorias}
                      </span>
                    )}

                    {/* Selected Tags Pills */}
                    {categorias.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {categorias.map((cat) => (
                          <span
                            key={cat}
                            className="font-inter text-[11px] bg-tur-dark text-white px-2 py-0.5 rounded-none flex items-center gap-1.5"
                          >
                            <span>{cat}</span>
                            <button
                              type="button"
                              onClick={() => toggleCategoria(cat)}
                              className="hover:text-tur-accent font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SELEÇÃO DE ACESSIBILIDADE */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                      Acessibilidade
                    </label>
                    
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccessMenuOpen((prev) => !prev);
                          setIsCategoryMenuOpen(false);
                        }}
                        className="w-full font-inter text-xs px-3.5 py-2.5 rounded-none border border-black/30 bg-transparent text-tur-dark hover:border-black font-medium cursor-pointer transition-all flex items-center justify-between gap-2"
                      >
                        <span className="truncate">
                          {acessibilidades.length > 0
                            ? `${acessibilidades.length} opção(ões) selecionada(s)`
                            : 'Selecionar acessibilidade...'}
                        </span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className={`transition-transform duration-200 shrink-0 ${isAccessMenuOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>

                      {/* Backdrop */}
                      {isAccessMenuOpen && (
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setIsAccessMenuOpen(false)}
                        />
                      )}

                      {/* Dropdown Menu Popover */}
                      <div className={`absolute left-0 top-full mt-1 w-full bg-white border border-black shadow-2xl z-30 p-2.5 flex flex-col gap-1.5 rounded-none transition-all duration-200 ease-out transform origin-top-left ${
                        isAccessMenuOpen 
                          ? 'opacity-100 translate-y-0 pointer-events-auto' 
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}>
                        <div className="relative w-full">
                          <input 
                            type="text" 
                            placeholder="Buscar acessibilidade..." 
                            value={accessSearchQuery}
                            onChange={(e) => setAccessSearchQuery(e.target.value)}
                            className="w-full font-inter text-xs border border-black/30 p-1.5 pr-7 rounded-none outline-none focus:border-black"
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-1/2 -translate-y-1/2 text-tur-gray-500 pointer-events-none">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                          </svg>
                        </div>

                        <div className="max-h-28 overflow-y-auto flex flex-col gap-0.5 pr-1">
                          {filteredAccessOptionsInMenu.map((acc) => {
                            const isSelected = acessibilidades.includes(acc);
                            return (
                              <button
                                key={acc}
                                type="button"
                                onClick={() => toggleAcessibilidade(acc)}
                                className="text-left font-inter text-xs px-2 py-1 transition-colors flex items-center gap-2 rounded-none hover:bg-black/5 text-tur-dark cursor-pointer"
                              >
                                <span className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                                  isSelected
                                    ? 'bg-tur-accent'
                                    : 'border border-black/30 bg-transparent'
                                }`} />
                                <span className={isSelected ? 'font-semibold text-tur-accent' : 'font-normal text-tur-dark'}>{acc}</span>
                              </button>
                            );
                          })}

                          {filteredAccessOptionsInMenu.length === 0 && (
                            <div className="font-inter text-xs text-tur-gray-500 py-1.5 text-center">
                              Nenhuma opção encontrada
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selected Tags Pills */}
                    {acessibilidades.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {acessibilidades.map((acc) => (
                          <span
                            key={acc}
                            className="font-inter text-[11px] bg-tur-dark text-white px-2 py-0.5 rounded-none flex items-center gap-1.5"
                          >
                            <span>{acc}</span>
                            <button
                              type="button"
                              onClick={() => toggleAcessibilidade(acc)}
                              className="hover:text-tur-accent font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTÕES VOLTAR E PRÓXIMO */}
                <div className="flex items-center justify-between mt-auto w-full">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-11 px-4 bg-transparent text-tur-dark font-dm-sans text-[14px] font-medium border border-black/30 rounded-none cursor-pointer transition-colors duration-200 hover:bg-black/5"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-8 bg-tur-dark text-white font-dm-sans text-[14px] font-semibold border-none rounded-none cursor-pointer tracking-[0.2px] flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-tur-dark-hover"
                  >
                    <span>Próximo</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 3: LOCALIZAÇÃO */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 justify-between mt-[75px] max-md:mt-6">
                <div className="flex flex-col gap-3">
                  {/* CEP & RUA GRID */}
                  <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="spot-cep" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                        CEP <span className="text-tur-accent">*</span>
                      </label>
                      <input
                        id="spot-cep"
                        type="text"
                        className={`w-full h-9 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 ${
                          fieldErrors.cep ? 'border-tur-red' : 'border-tur-gray-300'
                        }`}
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => {
                          setCep(e.target.value);
                          if (fieldErrors.cep) setFieldErrors((prev) => ({ ...prev, cep: undefined }));
                        }}
                      />
                      {fieldErrors.cep && (
                        <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                          {fieldErrors.cep}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="spot-rua" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                        Rua / Logradouro <span className="text-tur-accent">*</span>
                      </label>
                      <input
                        id="spot-rua"
                        type="text"
                        className={`w-full h-9 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 ${
                          fieldErrors.rua ? 'border-tur-red' : 'border-tur-gray-300'
                        }`}
                        placeholder="Ex: Av. Beira Mar, nº 100"
                        value={rua}
                        onChange={(e) => {
                          setRua(e.target.value);
                          if (fieldErrors.rua) setFieldErrors((prev) => ({ ...prev, rua: undefined }));
                        }}
                      />
                      {fieldErrors.rua && (
                        <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                          {fieldErrors.rua}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BAIRRO */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="spot-bairro" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                      Bairro <span className="text-tur-accent">*</span>
                    </label>
                    <input
                      id="spot-bairro"
                      type="text"
                      className={`w-full h-9 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 ${
                        fieldErrors.bairro ? 'border-tur-red' : 'border-tur-gray-300'
                      }`}
                      placeholder="Ex: Centro"
                      value={bairro}
                      onChange={(e) => {
                        setBairro(e.target.value);
                        if (fieldErrors.bairro) setFieldErrors((prev) => ({ ...prev, bairro: undefined }));
                      }}
                    />
                    {fieldErrors.bairro && (
                      <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                        {fieldErrors.bairro}
                      </span>
                    )}
                  </div>

                  {/* CIDADE & ESTADO (POPOVER PERSONALIZADO PARA UF) */}
                  <div className="grid grid-cols-[2fr_1fr] gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="spot-cidade" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                        Cidade <span className="text-tur-accent">*</span>
                      </label>
                      <input
                        id="spot-cidade"
                        type="text"
                        className={`w-full h-9 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 ${
                          fieldErrors.cidade ? 'border-tur-red' : 'border-tur-gray-300'
                        }`}
                        placeholder="Ex: Maragogi"
                        value={cidade}
                        onChange={(e) => {
                          setCidade(e.target.value);
                          if (fieldErrors.cidade) setFieldErrors((prev) => ({ ...prev, cidade: undefined }));
                        }}
                      />
                      {fieldErrors.cidade && (
                        <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                          {fieldErrors.cidade}
                        </span>
                      )}
                    </div>

                    {/* CUSTOM ESTADO / UF DROPDOWN POPOVER */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="spot-estado" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                        Estado <span className="text-tur-accent">*</span>
                      </label>
                      <div className="relative w-full">
                        <button
                          id="spot-estado"
                          type="button"
                          onClick={() => setIsEstadoMenuOpen((prev) => !prev)}
                          className={`w-full h-9 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b rounded-none outline-none transition-colors duration-200 cursor-pointer flex items-center justify-between ${
                            fieldErrors.estado ? 'border-tur-red' : 'border-tur-gray-300'
                          }`}
                        >
                          <span className={estado ? 'text-tur-dark font-medium' : 'text-tur-gray-400'}>
                            {estado || 'UF'}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 shrink-0 text-tur-gray-500 ${isEstadoMenuOpen ? 'rotate-180' : ''}`}
                          >
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </button>

                        {/* Backdrop */}
                        {isEstadoMenuOpen && (
                          <div 
                            className="fixed inset-0 z-20" 
                            onClick={() => setIsEstadoMenuOpen(false)}
                          />
                        )}

                        {/* Dropdown Menu Popover */}
                        <div className={`absolute right-0 top-full mt-1 w-24 bg-white border border-black shadow-2xl z-30 p-1 flex flex-col gap-0.5 rounded-none transition-all duration-200 ease-out transform origin-top-right ${
                          isEstadoMenuOpen 
                            ? 'opacity-100 translate-y-0 pointer-events-auto' 
                            : 'opacity-0 -translate-y-2 pointer-events-none'
                        }`}>
                          <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
                            {BRAZILIAN_STATES.map((uf) => (
                              <button
                                key={uf}
                                type="button"
                                onClick={() => {
                                  setEstado(uf);
                                  setIsEstadoMenuOpen(false);
                                  if (fieldErrors.estado) setFieldErrors((prev) => ({ ...prev, estado: undefined }));
                                }}
                                className={`text-center font-inter text-xs py-1 px-2 transition-colors rounded-none hover:bg-black/5 cursor-pointer ${
                                  estado === uf ? 'bg-tur-dark text-white font-bold' : 'text-tur-dark'
                                }`}
                              >
                                {uf}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      {fieldErrors.estado && (
                        <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                          {fieldErrors.estado}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* COMPLEMENTO */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="spot-complemento" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                      Complemento / Ponto de Referência
                    </label>
                    <input
                      id="spot-complemento"
                      type="text"
                      className="w-full h-9 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b border-tur-gray-300 rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400"
                      placeholder="Ex: Próximo à praça principal"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                    />
                  </div>
                </div>

                {/* BOTÕES VOLTAR E CADASTRAR */}
                <div className="flex items-center justify-between mt-auto w-full">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="h-11 px-4 bg-transparent text-tur-dark font-dm-sans text-[14px] font-medium border border-black/30 rounded-none cursor-pointer transition-colors duration-200 hover:bg-black/5"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 bg-tur-dark text-white font-dm-sans text-[14px] font-semibold border-none rounded-none cursor-pointer tracking-[0.2px] flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-tur-dark-hover"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
