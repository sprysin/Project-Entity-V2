import React, { useEffect, useState } from 'react';
import type { CardData } from '../../types';
import { GAME_CARDS } from '../../data/cards';
import PawnCard from '../PawnCard';
import UtilityCard from '../UtilityCard';

interface HandProps {
    cards?: CardData[]; // Pass empty array if we want to use internal mock for now
    isOpponent?: boolean;
}

const Hand: React.FC<HandProps> = ({ isOpponent = false }) => {
    const [handCards, setHandCards] = useState<CardData[]>([]);

    useEffect(() => {
        // MOCK DATA: Populate with 5x "Force Fire Sparker"
        const fireSparker = GAME_CARDS.find(c => c.id === 'force_fire_sparker');

        if (fireSparker) {
            // Create 5 copies
            const mockHand = Array(5).fill(fireSparker);
            setHandCards(mockHand);
        }
    }, []);

    return (
        <div className="player-hand" style={{
            display: 'flex',
            gap: isOpponent ? '5px' : '-40px', // Opponent cards are tighter, player cards fan out
            padding: '10px',
            justifyContent: 'center',
            alignItems: isOpponent ? 'flex-start' : 'flex-end',
            height: isOpponent ? '160px' : '300px', // More space for player cards to hover up
            pointerEvents: isOpponent ? 'none' : 'auto',
            perspective: '1000px'
        }}>
            {handCards.map((card, index) => (
                <div key={index} style={{
                    transformOrigin: 'bottom center',
                    transition: 'transform 0.2s ease, z-index 0s',
                    position: 'relative',
                    zIndex: index
                }}
                    onMouseEnter={(e) => {
                        if (!isOpponent) {
                            e.currentTarget.style.transform = 'translateY(-60px) scale(1.1)';
                            e.currentTarget.style.zIndex = '100';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isOpponent) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.zIndex = `${index}`;
                        }
                    }}
                >
                    {isOpponent ? (
                        // CARD BACK
                        <div style={{
                            width: '80px', // Smaller for opponent? Or keep same scale?
                            height: '112px',
                            background: 'repeating-linear-gradient(45deg, #111, #111 10px, #222 10px, #222 20px)',
                            border: '2px solid #444',
                            borderRadius: '5px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                        }} />
                    ) : (
                        // FULL CARD RENDER
                        /* Scale down slightly to fit hand if needed, or use CSS transform on the container */
                        <div style={{ transform: 'scale(0.8)', transformOrigin: 'bottom center' }}>
                            {card.cardFamily === 'Pawn' ? (
                                <PawnCard {...(card as any)} />
                            ) : (
                                <UtilityCard {...(card as any)} />
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Hand;
