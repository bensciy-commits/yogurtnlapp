import React, { useState } from 'react';
import { brainstormScriptIdeas } from './services/geminiService';
import { ScriptIdea, Difficulty } from './types';
import { IdeaCard } from './components/IdeaCard';
import { ScriptGeneratorModal } from './components/ScriptGeneratorModal';
import { IconSparkles, IconGamepad, IconZap, IconTerminal, IconVideo } from './components/Icons';

const POPULAR_GAMES = [
  "Murder Mystery 2", "Doors Floor 1", "The Glass Bridge", "Blox Fruits", "Pet Simulator 99", "BedWars",
];

function App() {
  const [activeTab, setActiveTab] = useState<'ideas' | 'custom'>('ideas');
  const [gameName, setGameName] = useState('Murder Mystery 2');
  
  // Brainstorm state
  const [ideas, setIdeas] = useState<ScriptIdea[]>([]);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  
  // Custom script state
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>(Difficulty.Medium);

  // Shared state
  const [selectedIdea, setSelectedIdea] = useState<ScriptIdea | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBrainstorm = async () => {
    if (!gameName.trim()) return;
    
    setIsBrainstorming(true);
    setError(null);
    setIdeas([]); // Clear previous

    try {
      const results = await brainstormScriptIdeas(gameName);
      setIdeas(results);
    } catch (e: any) {
      setError("Could not generate ideas. Ensure your API Key is valid.");
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleUniversalKit = () => {
    const targetGame = gameName.trim() || "Universal";
    if (!gameName.trim()) setGameName(targetGame);

    setSelectedIdea({
      title: "Universal God Mode Kit",
      description: "SAFE MODE ENABLED: Noclip (Toggle), Fly (CFrame), Infinite Jump, WalkSpeed Slider, NoFog, Full Light (FullBright), Fling All, Fling Target Player.",
      difficulty: Difficulty.Insane,
    });
  };

  const handleMM2Kit = () => {
    setGameName("Murder Mystery 2");
    setSelectedIdea({
      title: "MM2 OP Kit",
      description: "Auto Coins (Tween), Kill Aura (Murder), Auto Grab Gun, ESP Roles (Murder/Sheriff/Innocent - Updates 0.1s), Hitbox Expander (Size 10), Silent Aim.",
      difficulty: Difficulty.Insane,
    });
  };

  const handleDoorsKit = () => {
    setGameName("Doors");
    setSelectedIdea({
      title: "Doors OP Kit (Optimized)",
      description: "LAG FREE + ANTI-CRASH: Includes Closets/Wardrobes, Doors, Keys, Books, Chests, Breakers, Noclip, Loot Aura, Code Solver, FullBright, Speed, Fly.",
      difficulty: Difficulty.Insane,
    });
  };
  
  const handleGlassBridgeKit = () => {
    setGameName("The Glass Bridge");
    setSelectedIdea({
      title: "Glass Bridge God Mode",
      description: "Auto Highlight Safe Path (Green for Tempered, Red for Weak). Uses 'Step' model detection. Includes WalkSpeed, JumpPower, and Anti-Fall.",
      difficulty: Difficulty.Easy,
    });
  };

  const handleCustomGenerate = () => {
    if (!gameName.trim() || !customTitle.trim() || !customDescription.trim()) {
      setError("Please fill in all fields for the custom script.");
      return;
    }
    setError(null);
    setSelectedIdea({
      title: customTitle,
      description: customDescription,
      difficulty: customDifficulty,
    });
  };
  
  const handleTutorial = () => {
    const query = "how to use roblox scripts synapse scriptware";
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  };

  const difficultyColors = {
    [Difficulty.Easy]: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20',
    [Difficulty.Medium]: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20',
    [Difficulty.Hard]: 'text-red-400 border-red-500/50 bg-red-500/10 hover:bg-red-500/20',
    [Difficulty.Insane]: 'text-purple-400 border-purple-500/50 bg-purple-600/10 hover:bg-purple-600/20 shadow-[0_0_10px_rgba(147,51,234,0.1)]',
  };

  const isMM2 = gameName.toLowerCase().includes("murder mystery 2") || gameName.toLowerCase().includes("mm2");
  const isDoors = gameName.toLowerCase().includes("doors");
  const isGlassBridge = gameName.toLowerCase().includes("glass bridge");

  return (
    <div className="min-h-screen flex text-slate-200 font-sans selection:bg-primary-500/30 selection:text-white">
      
      {/* Sidebar - Desktop Only for aesthetic matching */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-950 border-r border-slate-800/50 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="font-bold text-white text-lg">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">GenAI Studio</span>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('ideas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'ideas' 
                ? 'bg-slate-900 border border-slate-800 text-white shadow-sm ring-1 ring-slate-800' 
                : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
            }`}
          >
            <IconSparkles className={activeTab === 'ideas' ? "text-yellow-400" : "text-slate-500"} />
            <div className="text-left">
              <div className="font-medium text-sm">Quick Ideas</div>
              <div className="text-xs text-slate-500">Automation features</div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('custom')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'custom' 
                ? 'bg-slate-900 border border-slate-800 text-white shadow-sm ring-1 ring-slate-800' 
                : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'
            }`}
          >
            <IconTerminal className={activeTab === 'custom' ? "text-primary-400" : "text-slate-500"} />
            <div className="text-left">
              <div className="font-medium text-sm">Custom Script</div>
              <div className="text-xs text-slate-500">Build your own</div>
            </div>
          </button>
          
          <button 
            onClick={handleTutorial}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-900/50 hover:text-white`}
          >
            <IconVideo className="text-red-400" />
            <div className="text-left">
              <div className="font-medium text-sm">How to Use</div>
              <div className="text-xs text-slate-500">YouTube Tutorials</div>
            </div>
          </button>
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800/80">
          <h4 className="text-indigo-400 text-sm font-semibold mb-2">Pro Tip</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            {activeTab === 'ideas' 
              ? "Specify the exact game name for better context aware suggestions." 
              : "Check the F9 Console in Roblox if the script does not load immediately."}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617]">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-6 lg:px-10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="lg:hidden font-bold text-lg flex items-center gap-2">
            <span className="text-primary-500">R</span> GenAI
          </div>
          <div className="ml-auto flex items-center gap-4 text-xs font-medium text-slate-500">
            <span>Powered by Gemini 3 Pro</span>
            <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Online
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {/* Main Container */}
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* QUICK IDEAS VIEW */}
            {activeTab === 'ideas' && (
              <>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
                  <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex-1 relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      <input
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="Enter Roblox Game Name..."
                        className="relative w-full bg-slate-950 text-white placeholder-slate-500 px-5 py-4 rounded-lg border border-slate-800 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all text-lg"
                      />
                    </div>
                    <div className="flex gap-4 shrink-0 overflow-x-auto pb-1 xl:pb-0">
                      <button
                        onClick={handleBrainstorm}
                        disabled={isBrainstorming}
                        className="flex-1 xl:flex-none px-6 py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg shadow-primary-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[140px] whitespace-nowrap"
                      >
                        {isBrainstorming ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <IconZap />
                            Brainstorm
                          </>
                        )}
                      </button>
                      
                      {isMM2 && (
                        <button
                          onClick={handleMM2Kit}
                          className="flex-1 xl:flex-none px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.15)] min-w-[140px] whitespace-nowrap animate-in zoom-in duration-300"
                        >
                          <IconGamepad className="w-5 h-5" />
                          MM2 OP Kit
                        </button>
                      )}

                      {isDoors && (
                        <button
                          onClick={handleDoorsKit}
                          className="flex-1 xl:flex-none px-6 py-4 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 font-bold rounded-lg border border-teal-500/30 hover:border-teal-500/50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.15)] min-w-[140px] whitespace-nowrap animate-in zoom-in duration-300"
                        >
                          <IconGamepad className="w-5 h-5" />
                          Doors OP Kit
                        </button>
                      )}
                      
                      {isGlassBridge && (
                        <button
                          onClick={handleGlassBridgeKit}
                          className="flex-1 xl:flex-none px-6 py-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.15)] min-w-[140px] whitespace-nowrap animate-in zoom-in duration-300"
                        >
                          <IconGamepad className="w-5 h-5" />
                          Bridge God Mode
                        </button>
                      )}

                      <button
                        onClick={handleUniversalKit}
                        className="flex-1 xl:flex-none px-6 py-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.15)] min-w-[140px] whitespace-nowrap"
                      >
                        <IconGamepad className="w-5 h-5" />
                        Universal Kit
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Popular:</span>
                    {POPULAR_GAMES.map(game => (
                      <button
                        key={game}
                        onClick={() => { setGameName(game); }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-full border border-slate-700 transition-colors"
                      >
                        {game}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Results */}
                {ideas.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Generated Features</h3>
                      <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                        {ideas.length} results
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {ideas.map((idea, index) => (
                        <IdeaCard 
                          key={index} 
                          idea={idea} 
                          onClick={() => setSelectedIdea(idea)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {ideas.length === 0 && !isBrainstorming && !error && (
                  <div className="text-center py-20 opacity-50">
                    <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4">
                      <IconSparkles className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300">No ideas generated yet</h3>
                    <p className="text-slate-500 mt-2">Enter a game name or click Universal Kit to start.</p>
                  </div>
                )}
              </>
            )}

            {/* CUSTOM SCRIPT VIEW */}
            {activeTab === 'custom' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                  
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-800/50 pb-6">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                      <IconTerminal className="text-primary-400 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Custom Script Generator</h2>
                      <p className="text-slate-400 text-sm">Define your own logic and generate a script instantly.</p>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target Game Name</label>
                      <input
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="e.g. Blox Fruits"
                        className="w-full bg-slate-950 text-white placeholder-slate-600 px-4 py-3 rounded-lg border border-slate-800 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Script Title</label>
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="e.g. Auto Farm Level 1-100"
                          className="w-full bg-slate-950 text-white placeholder-slate-600 px-4 py-3 rounded-lg border border-slate-800 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                        />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">Complexity Level</label>
                         <div className="grid grid-cols-4 gap-2">
                           {Object.values(Difficulty).map((diff) => (
                             <button
                               key={diff}
                               onClick={() => setCustomDifficulty(diff)}
                               className={`text-xs font-bold py-3 px-1 rounded-lg border transition-all ${
                                 customDifficulty === diff 
                                   ? difficultyColors[diff] + ' ring-1 ring-white/10'
                                   : 'text-slate-500 border-slate-800 bg-slate-900 hover:bg-slate-800'
                               }`}
                             >
                               {diff}
                             </button>
                           ))}
                         </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description</label>
                      <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        rows={5}
                        placeholder="Describe exactly what the script should do. E.g., 'Teleport the player to the nearest mob, attack it using the equipped weapon, and collect the loot drop automatically.'"
                        className="w-full bg-slate-950 text-white placeholder-slate-600 px-4 py-3 rounded-lg border border-slate-800 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleCustomGenerate}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-primary-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <IconZap />
                        Configure & Generate Script
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-950/30 border border-red-900 text-red-200 text-sm text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <ScriptGeneratorModal 
        idea={selectedIdea} 
        gameName={gameName}
        onClose={() => setSelectedIdea(null)} 
      />

    </div>
  );
}

export default App;