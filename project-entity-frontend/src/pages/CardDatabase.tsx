import React from 'react';
import PawnCard from '../components/PawnCard';
import UtilityCard from '../components/UtilityCard';
import type { PawnAttribute } from '../components/PawnCard';
import type { UtilityCardType, UtilitySubType } from '../components/UtilityCard';

// --- Mock Data ---
type MockPawn = {
    cardFamily: 'Pawn';
    id: string;
    name: string;
    level: number;
    attribute: PawnAttribute;
    pawnType: string;
    effectText: string;
    attack: number;
    defense: number;
};

type MockUtility = {
    cardFamily: 'Utility';
    id: string;
    name: string;
    type: UtilityCardType;
    subType: UtilitySubType;
    effectText: string;
};

type MockCard = MockPawn | MockUtility;

const MOCK_CARDS: MockCard[] = [
    {
        cardFamily: 'Pawn',
        id: 'solstice_sentinel',
        name: 'Solstice Sentinel',
        level: 4,
        attribute: 'Light',
        pawnType: 'Mechanical',
        effectText: 'When this card is summoned, gain 100 Life Points.',
        attack: 120,
        defense: 100,
    },
    {
        cardFamily: 'Pawn',
        id: 'high_king_of_the_west',
        name: 'High King of the West',
        level: 5,
        attribute: 'Earth',
        pawnType: 'Warrior',
        effectText: 'ON SUMMON: Target 1 face-up monster on the field; it loses 20 ATK.',
        attack: 170,
        defense: 50,
    },
    {
        cardFamily: 'Utility',
        id: 'void_blast',
        name: 'Void Blast',
        type: 'Action',
        subType: 'Normal',
        effectText: 'Deal 50 damage to your opponent.',
    },
    {
        cardFamily: 'Utility',
        id: 'reinforcement',
        name: 'Reinforcement',
        type: 'Condition',
        subType: 'Lingering',
        effectText: 'Target 1 Pawn on the field. It gains +20 ATK.',
    },
];

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
                {MOCK_CARDS.map(card => (
                    card.cardFamily === 'Pawn'
                        ? <PawnCard key={card.id} {...card} />
                        : <UtilityCard key={card.id} {...card} />
                ))}
            </div>
        </div>
    );
};

export default CardDatabase;
