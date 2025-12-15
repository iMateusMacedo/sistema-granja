"use client";

import { useState, useEffect, FormEvent } from 'react';

// --- SVG Icons ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 7.072l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>;
const LockClosedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;
const LockOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 00-5 5v2H4a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm0 2a3 3 0 00-3 3v2h6V7a3 3 0 00-3-3zm-3 7h6v5H7v-5z" /></svg>;

// --- Next.js Image Component ---
import Image from 'next/image';

// --- Interfaces ---
interface BatchData { id: number; numFrangos: number; pesoTotalLote: number; }
interface CalculationHistory { id: string; createdAt: string; galpao: string; batches: Omit<BatchData, 'id'>[]; numSacos: number; numFrangosPesados: number; pesoTotalFrangos: number; pesoMedio: number; }

const galpoes = ["Galpão 1", "Galpão 2", "Galpão 3", "Galpão 4", "Galpão 5"];

// --- Type definition for Theme ---
type Theme = 'light' | 'dark';

// --- Modal Component ---
const AddBatchModal = ({ isOpen, onClose, onAddBatch, theme, fixedFrangos, setFixedFrangos }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAddBatch: (batch: Omit<BatchData, 'id'>) => void; 
  theme: Theme;
  fixedFrangos: number | null;
  setFixedFrangos: (value: number | null) => void;
}) => {
  const [numFrangos, setNumFrangos] = useState('');
    const [pesoTotalLote, setPesoTotalLote] = useState('');
  
    const handleConfirm = () => {
      const batch = { numFrangos: parseInt(numFrangos, 10) || 0, pesoTotalLote: parseFloat(pesoTotalLote) || 0, };
      if (batch.numFrangos > 0 && batch.pesoTotalLote > 0) {
        onAddBatch(batch);
        onClose();
      } else {
        alert("Por favor, preencha todos os campos com valores válidos.");
      }
    };
  
    useEffect(() => {
      if (fixedFrangos !== null) {
        setNumFrangos(fixedFrangos.toString());
      } else {
        setNumFrangos('');
      }
    }, [isOpen, fixedFrangos]); // 'isOpen' is needed here to re-trigger effect when modal opens
  
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          handleConfirm();
        }
      };
  
      if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
      }
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, handleConfirm]);
    
    const handleFixValue = () => {
      if (fixedFrangos !== null) {
        // Se já estiver fixado, desfixar
        setFixedFrangos(null);
      } else {
        // Se não estiver fixado, fixar o valor atual
        const frangos = parseInt(numFrangos, 10);
        if (frangos > 0) {
          setFixedFrangos(frangos);
        }
      }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-amber-500/20'} p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all `}>
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-black' : 'text-amber-400'}`}>Adicionar Saco</h2>
          <Image 
            src={theme === 'light' ? '/GT PRETO.svg' : '/GT BRANCO.svg'}
            alt="Logo Grupo Talento"
            width={80}
            height={80}
            priority
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>Adicionar Peso do Saco</label>
            <input type="number" value={pesoTotalLote} onChange={(e) => setPesoTotalLote(e.target.value)} className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 transition ${theme === 'light' ? 'border-slate-300 focus:ring-indigo-500' : 'bg-gray-900 border-gray-700 text-white focus:ring-amber-500'}`} placeholder="Ex: 125.5" step="0.1" />
          </div>
          <div>
            <label className={`block text-sm font-semibold ${theme === 'light' ? 'text-black' : 'text-gray-300'}`}>Adicionar Número de Frangos</label>
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="number" 
                value={numFrangos} 
                onChange={(e) => setNumFrangos(e.target.value)} 
                disabled={fixedFrangos !== null} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition ${theme === 'light' ? 'border-slate-300 focus:ring-indigo-500' : 'bg-gray-900 border-gray-700 text-white focus:ring-amber-500'} disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-700`} 
                placeholder="Ex: 50" 
              />
              <button 
                onClick={handleFixValue} 
                title={fixedFrangos !== null ? "Desbloquear para alterar" : "Salvar e bloquear valor"}
                className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${fixedFrangos !== null ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${fixedFrangos !== null ? 'translate-x-3' : '-translate-x-3'}`} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onClose} className={`px-5 py-2 font-semibold rounded-lg transition-colors ${theme === 'light' ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}>Cancelar</button>
          <button onClick={handleConfirm} className={`px-5 py-2 font-bold rounded-lg shadow-sm transition-all ${theme === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-amber-500/20'}`}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function Home() {
  const [theme, setTheme] = useState<Theme>('light');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galpao, setGalpao] = useState(galpoes[0]);
  const [pendingBatches, setPendingBatches] = useState<BatchData[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [fixedFrangos, setFixedFrangos] = useState<number | null>(null);
  const [calculationResult, setCalculationResult] = useState<{ totalSacos: number; totalFrangos: number; totalPeso: number; pesoMedio: number } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/weigh-ins');
      if (!response.ok) throw new Error('Falha ao buscar o histórico.');
      const data = await response.json();
      setHistory(data.weighIns || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBatch = (batch: Omit<BatchData, 'id'>) => {
    setPendingBatches(prev => [...prev, { ...batch, id: Date.now() }]);
    setCalculationResult(null);
  };

  const handleRemoveBatch = (id: number) => {
    setPendingBatches(prev => prev.filter(b => b.id !== id));
    setCalculationResult(null);
  };
  
  const handleCalculate = () => {
    if (pendingBatches.length === 0) {
      setError("Adicione pelo menos um saco para calcular.");
      return;
    }
    setError(null);
    const totalSacos = pendingBatches.length;
    const totalFrangos = pendingBatches.reduce((sum, b) => sum + b.numFrangos, 0);
    const totalPeso = pendingBatches.reduce((sum, b) => sum + b.pesoTotalLote, 0);
    const pesoAjustado = totalPeso - (totalSacos * 0.3);
    const pesoMedio = totalFrangos > 0 ? pesoAjustado / totalFrangos : 0;
    setCalculationResult({ totalSacos, totalFrangos, totalPeso, pesoMedio });
  };

  const handleSaveOrUpdateHistory = async () => {
    if (!calculationResult) {
      setError("Realize um cálculo antes de salvar.");
      return;
    }
    const isUpdating = editingHistoryId !== null;
    const url = '/api/weigh-ins';
    const method = isUpdating ? 'PUT' : 'POST';
    const payload = { id: isUpdating ? editingHistoryId : undefined, galpao, batches: pendingBatches.map(({ id, ...rest }) => rest) };
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(isUpdating ? 'Falha ao atualizar o registro.' : 'Falha ao salvar o cálculo.');
      resetCalculatorState();
      await fetchHistory();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (entry: CalculationHistory) => {
    const batchesWithIds = (entry.batches || []).map((batch, index) => ({ ...batch, id: Date.now() + index }));
    setPendingBatches(batchesWithIds);
    setGalpao(entry.galpao);
    setEditingHistoryId(entry.id);
    setCalculationResult(null);
    setFixedFrangos(null); // Reset fixed value when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Você tem certeza que deseja apagar este registro?')) {
      try {
        const response = await fetch(`/api/weigh-ins?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao apagar o registro.');
        await fetchHistory();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const resetCalculatorState = () => {
    setPendingBatches([]);
    setCalculationResult(null);
    setEditingHistoryId(null);
    setGalpao(galpoes[0]);
    setError(null);
    setFixedFrangos(null);
  };

  return (
    <>
      {isAddModalOpen && <AddBatchModal 
        isOpen={isAddModalOpen} // Explicitly pass isOpen
        onClose={() => setAddModalOpen(false)} 
        onAddBatch={handleAddBatch} 
        theme={theme}
        fixedFrangos={fixedFrangos}
        setFixedFrangos={setFixedFrangos}
      />}
      
      <div className={`min-h-screen font-sans transition-colors ${theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-gray-900 text-gray-200'}`}>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="text-center mb-10 relative">
            <div className="mt-4 flex justify-center">
              <Image 
                src={theme === 'light' ? '/GT PRETO.svg' : '/GT BRANCO.svg'}
                alt="Logo Grupo Talento"
                width={250}
                height={250}
                priority
              />
            </div>
            
            <p className={`text-lg mt-2 ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>Calculadora Peso Frango</p>
            <button onClick={toggleTheme} className={`absolute top-0 right-0 p-2 rounded-full transition-colors ${theme === 'light' ? 'text-slate-700 hover:bg-slate-200' : 'text-amber-400 hover:bg-gray-800'}`}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-xl shadow-lg space-y-6 h-full transition-colors ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-amber-500/20'}`}>
                {editingHistoryId && (
                  <div className={`p-3 border-l-4 rounded-r-lg ${theme === 'light' ? 'bg-yellow-100 border-yellow-500 text-yellow-800' : 'bg-yellow-900/50 border-yellow-500 text-yellow-300'}`}>
                    <p className="font-bold">Modo de Edição</p>
                    <p className="text-sm">Você está editando um registro. Altere a lista, recalcule e atualize.</p>
                  </div>
                )} 
                <div>
                  <label htmlFor="galpao" className={`block text-sm font-semibold mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>Galpão</label>
                  <select id="galpao" value={galpao} onChange={(e) => setGalpao(e.target.value)} className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 transition-colors ${theme === 'light' ? 'border-slate-300 focus:ring-indigo-500' : 'bg-gray-900 border-gray-700 text-white focus:ring-amber-500'} disabled:bg-gray-700`} disabled={editingHistoryId !== null}>
                    {galpoes.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex-grow">
                  <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-700' : 'text-gray-200'}`}>Sacos Adicionados</h3>
                  <div className={`mt-2 space-y-2 max-h-60 overflow-y-auto border-dashed border-2 rounded-lg p-3 transition-colors ${theme === 'light' ? 'border-slate-300' : 'bg-gray-900/50 border-gray-700'}`}>
                    {pendingBatches.length === 0 ? (
                      <div className="text-center py-4"><p className="text-sm text-gray-500">Nenhum saco adicionado.</p></div>
                    ) : (
                      pendingBatches.map(batch => (
                        <div key={batch.id} className={`flex justify-between items-center p-2.5 rounded-lg shadow-sm transition-colors ${theme === 'light' ? 'bg-slate-100' : 'bg-gray-800'}`}>
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>{batch.numFrangos} frangos, {batch.pesoTotalLote}kg</span>
                          <button onClick={() => handleRemoveBatch(batch.id)} className="text-gray-500 hover:text-red-500 transition-colors"><XIcon/></button>
                        </div>
                      ))
                    )}
                  </div>
                  <button onClick={() => setAddModalOpen(true)} className={`w-full mt-2 flex items-center justify-center gap-2 border-2 border-dashed font-bold py-2 px-4 rounded-lg transition-colors ${theme === 'light' ? 'border-slate-400 text-slate-600 hover:bg-slate-50 hover:border-slate-500' : 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500'}`}>
                    <PlusIcon /> Adicionar Saco
                  </button>
                </div>

                <button onClick={handleCalculate} className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all text-lg ${theme === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-amber-500 text-black hover:bg-amber-400'}`}>
                  Realizar Cálculo
                </button>

                {calculationResult && (
                  <div className={`p-4 rounded-xl text-center space-y-2 transition-all duration-300 ${theme === 'light' ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-900/50 border-2 border-amber-500/30'}`}>
                    <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-indigo-800' : 'text-amber-400'}`}>Resultado Final</h3>
                    <p className={`text-5xl font-extrabold ${theme === 'light' ? 'text-indigo-600' : 'text-amber-300'}`}>{calculationResult.pesoMedio.toFixed(3)} kg</p>
                    <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>(Total: {calculationResult.totalSacos} sacos, {calculationResult.totalPeso.toFixed(1)}kg / {calculationResult.totalFrangos} frangos)</p>
                    <button onClick={handleSaveOrUpdateHistory} className="w-full mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-green-500">
                      {editingHistoryId ? 'Atualizar Registro' : 'Salvar no Histórico'}
                    </button>
                  </div>
                )}
                {editingHistoryId && (
                  <button onClick={resetCalculatorState} className={`w-full text-center text-sm font-semibold underline ${theme === 'light' ? 'text-slate-600 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}>
                    Cancelar Edição
                  </button>
                )}
                 {error && <p className="text-red-500 text-sm mt-2 text-center font-semibold">{error}</p>}
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg h-full transition-colors lg:col-span-2 ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-amber-500/20'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-gray-100'}`}>Histórico de Pesagens</h2>
              {isLoading ? <p className={`text-center ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Carregando...</p> : history.length === 0 ? <p className={`text-center pt-4 ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>Nenhum cálculo registrado.</p> : (
                <div className="overflow-x-auto max-h-[75vh]">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className={`${theme === 'light' ? 'bg-slate-50' : 'bg-gray-900/50'} sticky top-0`}>
                      <tr>
                        <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-amber-400'}`}>Data</th>
                        <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-amber-400'}`}>Galpão</th>
                        <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-amber-400'}`}>Peso Médio</th>
                        <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-amber-400'}`}>Detalhes</th>
                        <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-amber-400'}`}>Ações</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'light' ? 'bg-white divide-slate-200' : 'bg-gray-800 divide-gray-700'}`}>
                      {history.slice().reverse().map((item) => (
                        <tr key={item.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-gray-700/50'} transition-colors`}>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className={`px-5 py-4 whitespace-nowrap text-sm font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-gray-200'}`}>{item.galpao}</td>
                          <td className={`px-5 py-4 whitespace-nowrap text-sm font-bold ${theme === 'light' ? 'text-indigo-600' : 'text-amber-400'}`}>{item.pesoMedio.toFixed(3)}</td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400">{`${item.numSacos} sacos, ${item.numFrangosPesados} frangos, ${item.pesoTotalFrangos.toFixed(1)}kg`}</td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm flex items-center space-x-4">
                            <button onClick={() => handleEdit(item)} className={`font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${theme === 'light' ? 'text-indigo-600 hover:text-indigo-900' : 'text-amber-400 hover:text-amber-300'}`} disabled={!item.batches}>
                              <PencilIcon />
                              Editar
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 font-semibold flex items-center gap-1">
                              <TrashIcon />
                              Apagar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}