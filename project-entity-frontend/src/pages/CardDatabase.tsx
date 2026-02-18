import React from 'react';
import PawnCard from '../components/PawnCard';
import UtilityCard from '../components/UtilityCard';


import { GAME_CARDS } from '../data/cards';


interface DatabaseProps {
    onNavigate: (page: 'home' | 'database') => void;
}

const CardDatabase: React.FC<DatabaseProps> = ({ onNavigate }) => {
    return (
        <div className="card-database">
            {/* HEADER */}
            <div className="card-database__header">
                <h1 className="card-database__title">CARD DATABASE</h1>
                <button onClick={() => onNavigate('home')}>BACK TO MENU</button>
            </div>

            {/* CARD GRID */}
            <div className="card-database__grid">
                {GAME_CARDS.map(card => (
                    card.cardFamily === 'Pawn'
                        ? <PawnCard key={card.id} {...card} />
                        : <UtilityCard key={card.id} {...card} />
                ))}
            </div>
        </div>
    );
};

export default CardDatabase;
