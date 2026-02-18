import React from 'react';

export type PawnAttribute = 'Fire' | 'Water' | 'Earth' | 'Air' | 'Electric' | 'Normal' | 'Dark' | 'Light';

interface PawnCardProps {
    name: string;
    level: number;
    attribute: PawnAttribute;
    pawnType: string;
    effectText: string;
    attack: number;
    defense: number;
}

const ATTRIBUTE_GRADIENTS: Record<PawnAttribute, string> = {
    Fire: 'radial-gradient(circle, #ff6a00, #ee0979)',
    Water: 'radial-gradient(circle, #00c6ff, #0072ff)',
    Earth: 'radial-gradient(circle, #56ab2f, #a8e063)',
    Air: 'radial-gradient(circle, #b0e0ff, #e0f7ff)',
    Electric: 'radial-gradient(circle, #FFD700, #fffde4)',
    Normal: 'radial-gradient(circle, #888888, #cccccc)',
    Dark: 'radial-gradient(circle, #1a0033, #6a0dad)',
    Light: 'radial-gradient(circle, #FFD700, #ffffff)',
};

const ATTRIBUTE_LABELS: Record<PawnAttribute, string> = {
    Fire: 'FIRE', Water: 'WATER', Earth: 'EARTH', Air: 'AIR',
    Electric: 'ELEC', Normal: 'NORM', Dark: 'DARK', Light: 'LIGHT',
};

const PawnCard: React.FC<PawnCardProps> = ({ name, level, attribute, pawnType, effectText, attack, defense }) => {
    return (
        <div className="pawn-card card-shell">
            {/* HEADER: Name rectangle + Level square */}
            <div className="pawn-card__header">
                <div className="pawn-card__name">{name}</div>
                <div className="pawn-card__level">Lv.{level}</div>
            </div>

            {/* DESCRIPTOR: Attribute circle + typing */}
            <div className="pawn-card__descriptor">
                <div
                    className="attr-circle"
                    style={{ background: ATTRIBUTE_GRADIENTS[attribute] }}
                    title={attribute}
                >
                    <span className="attr-circle__label">{ATTRIBUTE_LABELS[attribute]}</span>
                </div>
                <span className="pawn-card__typing">[{pawnType}/Pawn]</span>
            </div>

            {/* ART AREA */}
            <div className="card-art-area">
                <div className="card-art-area__inner pawn-art-bg" />
            </div>

            {/* EFFECT TEXT */}
            <div className="card-effect-box">
                <p>{effectText}</p>
            </div>

            {/* STATS FOOTER */}
            <div className="pawn-card__footer">
                <span className="pawn-card__stat">ATK: {attack}</span>
                <span className="pawn-card__stat">DEF: {defense}</span>
            </div>
        </div>
    );
};

export default PawnCard;
