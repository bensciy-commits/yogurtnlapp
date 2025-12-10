import React, { useState, useEffect } from 'react';
import { ScriptIdea, UILibrary } from '../types';
import { generateLuaScript } from '../services/geminiService';
import { IconX, IconCode, IconCopy, IconCheck, IconZap, IconGamepad, IconDownload } from './Icons';

interface ScriptGeneratorModalProps {
  idea: ScriptIdea | null;
  gameName: string;
  onClose: () => void;
}

const THEME_COLORS = [
  { name: 'Violet', class: 'bg-violet-500', border: 'border-violet-400' },
  { name: 'Red', class: 'bg-red-500', border: 'border-red-400' },
  { name: 'Blue', class: 'bg-blue-500', border: 'border-blue-400' },
  { name: 'Green', class: 'bg-emerald-500', border: 'border-emerald-400' },
  { name: 'Orange', class: 'bg-orange-500', border: 'border-orange-400' },
  { name: 'White', class: 'bg-slate-200', border: 'border-white' },
];

export const ScriptGeneratorModal: React.FC<ScriptGeneratorModalProps> = ({ idea, gameName, onClose }) => {
  const [selectedLibrary, setSelectedLibrary] = useState<UILibrary>(UILibrary.Rayfield);
  const [themeColor, setThemeColor] = useState<string>('Violet');
  const [includeUniversalKit, setIncludeUniversalKit] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when idea changes
  useEffect(() => {
    setGeneratedCode('');
    setIsLoading(false);
    setError(null);
    setIncludeUniversalKit(false); // Reset universal kit toggle
    setThemeColor('Violet'); // Default theme
  }, [idea]);

  if (!idea) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const code = await generateLuaScript(gameName, idea, selectedLibrary, includeUniversalKit, themeColor);
      setGeneratedCode(code);
    } catch (err: any) {
      setError(err.message || "Something went wrong generating the script.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gameName.replace(/\s+/g, '_')}_Script.lua`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Insane': return 'border-purple-500/30 text-purple-400 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'Hard': return 'border-red-500/30 text-red-400 bg-red-500/10';
      case 'Medium': return 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10';
      default: return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <IconCode className="text-primary-500" />
              Script Generator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Target: <span className="text-primary-400 font-medium">{gameName}</span> — {idea.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <IconX />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/30">
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              {/* Library Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Select UI Library</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(UILibrary).map((lib) => (
                    <button
                      key={lib}
                      onClick={() => setSelectedLibrary(lib)}
                      className={`px-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                        selectedLibrary === lib
                          ? 'bg-primary-600 border-primary-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-750'
                      }`}
                    >
                      {lib}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">UI Theme Color</label>
                <div className="flex flex-wrap gap-3">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setThemeColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-400 ${color.class} ${
                        themeColor === color.name 
                          ? `scale-110 ${color.border} shadow-[0_0_10px_rgba(255,255,255,0.3)]` 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      title={color.name}
                    />
                  ))}
                  <span className="ml-2 text-sm text-slate-400 self-center">{themeColor}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Complexity Analysis</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(idea.difficulty)}`}>
                  {idea.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {idea.description} This script will be generated using {selectedLibrary} standards with proper error handling.
                <br/><br/>
                <span className="text-slate-400">Theme: {themeColor}</span>
              </p>
            </div>
          </div>

          {/* Universal Kit Toggle (The "Menu" feature requested) */}
          {!generatedCode && (
            <div 
              onClick={() => setIncludeUniversalKit(!includeUniversalKit)}
              className={`mb-8 border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                includeUniversalKit 
                  ? 'bg-primary-500/10 border-primary-500/50 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                  includeUniversalKit ? 'bg-primary-500 text-white' : 'bg-slate-800 border border-slate-600'
                }`}>
                  {includeUniversalKit && <IconCheck className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className={`font-semibold ${includeUniversalKit ? 'text-primary-400' : 'text-slate-300'}`}>
                    Add Universal Movement Kit?
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Includes <span className="text-slate-400">Fly, Noclip, Infinite Jump, WalkSpeed</span> automatically.
                  </p>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${includeUniversalKit ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-600'}`}>
                <IconGamepad className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Action or Result */}
          {!generatedCode && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center py-6">
              <button 
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <IconCode className="w-5 h-5" />
                <span>Generate Script {includeUniversalKit ? '& Movement Kit' : ''}</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-semibold text-white animate-pulse">Writing Code...</h3>
              <p className="text-slate-500 mt-2">
                Implementing {selectedLibrary} UI 
                {includeUniversalKit ? ' + Movement Kit' : ''}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-200 text-sm">
              Error: {error}
            </div>
          )}

          {generatedCode && (
            <div className="relative group animate-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                 <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md border border-slate-700 transition-colors"
                  title="Save as .lua file"
                >
                  <IconDownload className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md border border-slate-700 transition-colors"
                >
                  {isCopied ? <IconCheck className="w-3.5 h-3.5 text-emerald-400" /> : <IconCopy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="text-sm font-mono bg-slate-950 border border-slate-800 rounded-xl p-6 overflow-x-auto text-slate-300 leading-relaxed min-h-[300px]">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};