import React from 'react';

// Internally called "Utility" cards, but the player only ever sees "Action" or "Condition"
export type UtilityCardType = 'Action' | 'Condition';
export type UtilitySubType = 'Normal' | 'Lingering';

interface UtilityCardProps {
    name: string;
    type: UtilityCardType;
    subType: UtilitySubType;
    effectText: string;
}

const TYPE_ACCENT: Record<UtilityCardType, string> = {
    Action: '#00C864',
    Condition: '#FF64B4',
};

const UtilityCard: React.FC<UtilityCardProps> = ({ name, type, subType, effectText }) => {
    const accent = TYPE_ACCENT[type];

    return (
        <div className={`utility-card card-shell utility-card--${type.toLowerCase()}`}>
            {/* HEADER: Name only */}
            <div className="utility-card__header" style={{ borderColor: accent }}>
                <span className="utility-card__name">{name}</span>
            </div>

            {/* TYPE BAR: [Normal Action] / [Lingering Condition] */}
            <div className="utility-card__type-bar" style={{ color: accent, borderColor: accent }}>
                [{subType} {type}]
            </div>

            {/* ART AREA */}
            <div className="card-art-area">
                <div className={`card-art-area__inner utility-art-bg utility-art-bg--${type.toLowerCase()}`} />
            </div>

            {/* EFFECT TEXT */}
            <div className="card-effect-box">
                <p>{effectText}</p>
            </div>
        </div>
    );
};

export default UtilityCard;
