import React from 'react';
import PawnCard from '../PawnCard';
import UtilityCard from '../UtilityCard';
import type { CardData } from '../../types';

type ZoneType = 'entity' | 'action';
type ZoneOwner = 'active' | 'opponent';

interface ZoneProps {
    type: ZoneType;
    owner?: ZoneOwner;
    // Card data (null = empty slot)
    card?: CardData | null;
    isSelected?: boolean;
    isSelectable?: boolean;
    isTributeSelected?: boolean;
    isDropTarget?: boolean;
    onClick?: () => void;
    domRef?: (el: HTMLElement | null) => void;
    // Legacy props for backward compatibility
    label?: string;
    count?: number;
}

const Zone: React.FC<ZoneProps> = ({
    type,
    card = null,
    isSelected,
    isSelectable,
    isTributeSelected,
    isDropTarget,
    onClick,
    domRef,
    label,
}) => {
    const CARD_W = 223;
    const CARD_SCALE = 126 / CARD_W; // Fit perfectly in the 128px zone border

    // Determine border/state class
    const getStateClass = () => {
        if (isSelected) return 'border-yellow-400 scale-105 shadow-[0_0_30px_rgba(234,179,8,0.5)] z-10';
        if (isTributeSelected) return 'zone-tribute border-green-400 scale-105 z-10';
        if (isSelectable) return 'zone-selectable z-10';
        if (isDropTarget) return 'zone-drop-target z-10';
        return 'border-white/5 bg-black/40 hover:border-white/20';
    };

    // Empty zone icon
    const EmptyIcon = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.2 }}>
            {type === 'entity' ? (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                    <path d="M19 22H5V20H19V22M12 2C13.66 2 15 3.34 15 5C15 6.2 14.28 7.23 13.24 7.71C13.84 8.67 14.65 10.33 14.92 12H13.9C13.64 10.66 12.89 9.32 12 9.32C11.11 9.32 10.36 10.66 10.1 12H9.08C9.35 10.33 10.16 8.67 10.76 7.71C9.72 7.23 9 6.2 9 5C9 3.34 10.34 2 12 2M7 16V14H17V16H7M9 18V19H15V18H9Z" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                    <path d="M7,2V13H10V22L17,10H13L17,2H7Z" />
                </svg>
            )}
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', letterSpacing: '2px', color: 'white', fontWeight: 'bold' }}>
                {label || type.toUpperCase()}
            </span>
        </div>
    );

    const cardTypeClass = card?.cardFamily === 'Pawn' ? 'card-entity'
        : card?.type === 'Action' ? 'card-action'
            : card?.type === 'Condition' ? 'card-condition'
                : '';

    return (
        <div
            ref={domRef}
            onClick={onClick}
            className={`game-zone ${getStateClass()} ${card ? cardTypeClass : ''}`}
            style={{
                width: '128px',
                aspectRatio: '2/3',
                border: '2px solid',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.2s ease',
                flexShrink: 0,
            }}
        >
            {card ? (
                <div
                    className={`${card.isFaceDown ? 'card-back' : ''}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: (card.currentPosition === 'Defense' || (card.isFaceDown && card.cardFamily === 'Pawn')) ? 'rotate(90deg) scale(0.8)' : 'none',
                        transition: 'transform 0.7s ease',
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {card.isFaceDown ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--color-accent)">
                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" />
                            </svg>
                        </div>
                    ) : (
                        <div style={{
                            transform: `scale(${CARD_SCALE})`,
                            transformOrigin: 'center center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        }}>
                            {card.cardFamily === 'Pawn' ? (
                                <PawnCard
                                    name={card.name}
                                    level={card.level ?? 1}
                                    attribute={(card.attribute as any) ?? 'Light'}
                                    pawnType={card.pawnType ?? 'Warrior'}
                                    effectText={card.effectText}
                                    attack={card.attack ?? 0}
                                    defense={card.defense ?? 0}
                                />
                            ) : (
                                <UtilityCard
                                    name={card.name}
                                    type={(card.type as any) ?? 'Action'}
                                    subType={(card.subType as any) ?? 'Normal'}
                                    effectText={card.effectText}
                                />
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmptyIcon />
                </div>
            )}
        </div>
    );
};

export default Zone;
