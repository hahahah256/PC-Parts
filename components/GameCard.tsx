
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 ${
        isSelected ? 'border-cyan-500 ring-4 ring-cyan-500/20' : 'border-slate-800 hover:border-slate-600'
      }`}
    >
      <img src={game.image} alt={game.title} className="w-full h-40 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-bold text-lg leading-tight">{game.title}</h3>
        <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">{game.genre}</p>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-cyan-500 rounded-full p-1 shadow-lg">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};
