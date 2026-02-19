import React from 'react';
import type { CardData } from '../../types';
import { GAME_CARDS } from '../../data/cards';
import PawnCard from '../PawnCard';
import UtilityCard from '../UtilityCard';

interface HandProps {
    cards?: CardData[];
    isOpponent?: boolean;
    selectedHandIndex?: number | null;
    onCardClick?: (index: number) => void;
    drawStartIndex?: number | null;
    containerRef?: (el: HTMLElement | null) => void;
    domRef?: (index: number) => (el: HTMLElement | null) => void;
}

const CARD_SCALE = 0.7;
// Natural card dimensions (px)
const CARD_W = 223;
const CARD_H = 325;
// Scaled dimensions
const SCALED_W = Math.round(CARD_W * CARD_SCALE);
const SCALED_H = Math.round(CARD_H * CARD_SCALE);

const Hand: React.FC<HandProps> = ({
    cards,
    isOpponent = false,
    selectedHandIndex = null,
    onCardClick,
    containerRef,
    domRef,
}) => {
    // Mock hand if no cards provided
    const displayCards: CardData[] = cards ?? GAME_CARDS.slice(0, 5);

    if (isOpponent) {
        // Opponent hand: card backs peeking from top
        return (
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 20,
                    pointerEvents: 'none',
                }}
            >
                {displayCards.map((_, i) => (
                    <div
                        key={i}
                        className="card-back"
                        style={{
                            width: `${SCALED_W}px`,
                            height: `${SCALED_H}px`,
                            borderRadius: '4px',
                            border: '2px solid rgba(148, 163, 184, 0.4)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                            transform: 'translateY(-60%)',
                            transition: 'transform 0.3s ease',
                            marginLeft: i === 0 ? 0 : '-10px',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-10%)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(-60%)')}
                    />
                ))}
            </div>
        );
    }

    // Player hand: full PawnCard/UtilityCard visuals peeking from bottom
    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                zIndex: 50,
                pointerEvents: 'none',
            }}
        >
            {displayCards.map((card, i) => {
                const isSelected = selectedHandIndex === i;

                return (
                    // Outer wrapper: reserves the SCALED space in the layout
                    <div
                        key={card.id + i}
                        ref={domRef ? domRef(i) : undefined}
                        onClick={() => onCardClick?.(i)}
                        style={{
                            width: `${SCALED_W}px`,
                            height: `${SCALED_H}px`,
                            position: 'relative',
                            flexShrink: 0,
                            marginLeft: i === 0 ? 0 : '-14px',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            zIndex: isSelected ? 20 : 10,
                            // Translate the whole slot up/down
                            transform: isSelected ? 'translateY(-30%)' : 'translateY(55%)',
                            transition: 'transform 0.3s ease, z-index 0s',
                            outline: isSelected ? '3px solid #FFD700' : 'none',
                            outlineOffset: '2px',
                        }}
                        onMouseEnter={e => {
                            if (!isSelected) e.currentTarget.style.transform = 'translateY(10%)';
                        }}
                        onMouseLeave={e => {
                            if (!isSelected) e.currentTarget.style.transform = 'translateY(55%)';
                        }}
                    >
                        {/* Inner wrapper: applies CSS scale from bottom-center */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                transformOrigin: 'bottom center',
                                transform: `scale(${CARD_SCALE})`,
                                // Offset to align the scaled card within the slot
                                marginLeft: `${-(CARD_W - SCALED_W) / 2}px`,
                                pointerEvents: 'none',
                                filter: isSelected ? 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' : 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))',
                            }}
                        >
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
                    </div>
                );
            })}
        </div>
    );
};

export default Hand;
