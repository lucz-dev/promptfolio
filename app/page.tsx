"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Terminal, 
  Search, 
  Linkedin, 
  Copy, 
  ExternalLink, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Wind
} from 'lucide-react';
import { PROMPTS_DATA } from '@/lib/prompt';
import { Prompt, Category } from '@/lib/prompt';

// --- 2. Configuration & Helpers ---
const CATEGORY_COLORS = {
  'Frontend': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Backend': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'DevOps': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Quality': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Social': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Ideation': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Startup': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const getCategoryStyle = (cat: Category) => CATEGORY_COLORS[cat] || 'bg-slate-700/50 text-slate-300 border-slate-600';

// --- 3. Main Application Component ---
export default function Promptfolio() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPrompt, setModalPrompt] = useState<Prompt | null>(null); // null means closed
  const [showToast, setShowToast] = useState(false);

  const itemsPerPage = 12;

  // Filter Logic (Memoized)
  const filteredPrompts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return PROMPTS_DATA.filter(prompt => {
      const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
      const matchesSearch =
        prompt.title.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query)) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query);
      
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  
  // Ensure we don't stay on a dead page if filter changes
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [selectedCategory, searchQuery]);

  const currentPrompts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPrompts.slice(start, start + itemsPerPage);
  }, [currentPage, filteredPrompts]);

  // Actions
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Categories
  const categories = useMemo(() => ['All', ...new Set(PROMPTS_DATA.map(p => p.category))], []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Custom Styles for Animation (Simulating Tailwind Config) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.5s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      {/* --- Header --- */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 animate-fade-up opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.location.reload()}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">Promptfolio</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              v1.2.0 (React)
            </span>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Hero & Search */}
        <div 
          className="text-center max-w-2xl mx-auto mb-8 animate-fade-up opacity-0"
          style={{ animationDelay: '100ms' }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Libreria Prompt per Sviluppatori
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Collezione curata di prompt per Coding, Startup e Ideazione.
          </p>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xl shadow-black/20 outline-none" 
              placeholder="Cerca prompt (es. Startup, React, Pitch Deck...)"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <span className="hidden sm:inline-block px-2 py-1 text-xs font-mono text-slate-500 bg-slate-800 rounded border border-slate-700">
                CTRL + K
              </span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div 
          className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-up opacity-0"
          style={{ animationDelay: '200ms' }}
        >
          {categories.map(cat => {
             const isActive = selectedCategory === cat;
             return (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                   isActive 
                   ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25' 
                   : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                 }`}
               >
                 {cat}
               </button>
             );
          })}
        </div>

        {/* Stats */}
        <div 
          className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4 animate-fade-up opacity-0"
          style={{ animationDelay: '300ms' }}
        >
          <div className="text-slate-400 text-sm">
            <span className="text-indigo-400 font-semibold">{selectedCategory === 'All' ? 'Tutti' : selectedCategory}</span>
            <span className="mx-2">&bull;</span> 
            <span className="font-mono text-white font-bold">{filteredPrompts.length}</span> prompt
          </div>
        </div>

        {/* Grid Container */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPrompts.map((prompt, index) => (
              <div 
                key={prompt.id}
                onClick={() => setModalPrompt(prompt)}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                </div>
                
                <div className="mb-4 flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getCategoryStyle(prompt.category)}`}>
                    {prompt.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                  {prompt.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                  <div className="flex gap-2 overflow-hidden">
                    {prompt.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopy(prompt.content); }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-slate-700 flex items-center gap-2 z-10 shrink-0"
                  >
                    <Copy className="w-3 h-3" /> Copia
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-20 animate-fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 mb-4">
              <Wind className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white">Nessun prompt trovato</h3>
            <p className="text-slate-500">Prova a cambiare categoria o termini di ricerca.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div 
            className="flex justify-center items-center gap-2 mt-12 animate-fade-up opacity-0"
            style={{ animationDelay: '400ms' }}
          >
            <button 
              onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                currentPage === 1 
                ? 'border-slate-800 text-slate-600 cursor-not-allowed' 
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  page === currentPage
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                currentPage === totalPages 
                ? 'border-slate-800 text-slate-600 cursor-not-allowed' 
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* --- Footer --- */}
      <footer 
        className="border-t border-slate-800 bg-slate-950 py-8 mt-12 animate-fade-up opacity-0"
        style={{ animationDelay: '500ms' }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Promptfolio. Created by{' '}
            <a href="https://lucz.dev" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              LuCz
            </a>.
          </p>
        </div>
      </footer>

      {/* --- Modal --- */}
      {modalPrompt && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
          onClick={() => setModalPrompt(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 border-b border-slate-800">
              <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border mb-2 inline-block ${getCategoryStyle(modalPrompt.category)}`}>
                  {modalPrompt.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {modalPrompt.title}
                </h3>
              </div>
              <button 
                onClick={() => setModalPrompt(null)}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <p className="text-slate-400 mb-6 italic">
                {modalPrompt.description}
              </p>
              
              <div className="relative">
                <div className="absolute top-3 right-3">
                  <button 
                    onClick={() => handleCopy(modalPrompt.content)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-1.5 rounded-md border border-slate-600 transition-all flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" /> Copia
                  </button>
                </div>
                <pre className="bg-slate-950 p-6 rounded-xl border border-slate-800 overflow-x-auto">
                  <code className="font-mono text-sm text-indigo-100 whitespace-pre-wrap">
                    {modalPrompt.content}
                  </code>
                </pre>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setModalPrompt(null)}
                className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors"
              >
                Chiudi
              </button>
              <button 
                onClick={() => { handleCopy(modalPrompt.content); setModalPrompt(null); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all"
              >
                Copia & Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Toast --- */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <div className="bg-green-500/20 text-green-400 w-8 h-8 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-sm">Copiato nella clipboard!</p>
          </div>
        </div>
      </div>

    </div>
  );
}
