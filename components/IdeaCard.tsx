import React from 'react';
import { ScriptIdea, Difficulty } from '../types';

interface IdeaCardProps {
  idea: ScriptIdea;
  onClick: () => void;
}

const difficultyColors = {
  [Difficulty.Easy]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  [Difficulty.Medium]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  [Difficulty.Hard]: 'bg-red-500/10 text-red-400 border-red-500/20',
  [Difficulty.Insane]: 'bg-purple-600/10 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]',
};

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col p-5 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-primary-500/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-slate-100 group-hover:text-primary-400 transition-colors">
          {idea.title}
        </h3>
        <span className={`px-2 py-0.5 text-xs font-medium uppercase tracking-wide rounded-full border ${difficultyColors[idea.difficulty]}`}>
          {idea.difficulty}
        </span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">
        {idea.description}
      </p>
      
      <div className="mt-auto flex items-center text-xs text-slate-500 font-medium group-hover:text-slate-300 transition-colors">
        <span>Click to Generate Script</span>
        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
};