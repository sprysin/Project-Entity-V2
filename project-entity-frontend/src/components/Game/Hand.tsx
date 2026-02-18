import React from 'react';

interface HandCard {
    instanceId?: string;
    name: string;
    effectText?: string;
    atk?: number;
    def?: number;
    cardType?: 'entity' | 'action' | 'condition';
}

interface HandProps {
    cards?: HandCard[];
    isOpponent?: boolean;
    selectedHandIndex?: number | null;
    onCardClick?: (index: number) => void;
    drawStartIndex?: number | null;
    containerRef?: (el: HTMLElement | null) => void;
    domRef?: (index: number) => (el: HTMLElement | null) => void;
}

const Hand: React.FC<HandProps> = ({
    cards,
    isOpponent = false,
    selectedHandIndex = null,
    onCardClick,
    drawStartIndex = null,
    containerRef,
    domRef,
}) => {
    // Mock hand if no cards provided
    const displayCards: HandCard[] = cards ?? Array(5).fill({
        instanceId: 'mock',
        name: 'Force Fire Sparker',
        effectText: 'ON NORMAL SUMMON: Deal 10 damage for each set Action/Condition on opponent\'s field.',
        atk: 30,
        def: 150,
        cardType: 'entity',
    });

    const getCardTypeClass = (card: HandCard) => {
        if (card.cardType === 'entity') return 'card-entity glow-gold';
        if (card.cardType === 'action') return 'card-action glow-green';
        if (card.cardType === 'condition') return 'card-condition glow-pink';
        return 'card-entity glow-gold';
    };

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
                    gap: '-10px',
                    zIndex: 20,
                    pointerEvents: 'none',
                }}
            >
                {displayCards.map((_, i) => (
                    <div
                        key={i}
                        className="card-back"
                        style={{
                            width: '112px',
                            aspectRatio: '2/3',
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

    // Player hand: cards peeking from bottom
    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 50,
                pointerEvents: 'none',
                paddingBottom: 0,
            }}
        >
            {displayCards.map((card, i) => {
                const isSelected = selectedHandIndex === i;
                const isDrawing = drawStartIndex !== null && i >= drawStartIndex;
                const cardTypeClass = getCardTypeClass(card);

                return (
                    <div
                        key={card.instanceId ?? i}
                        ref={domRef ? domRef(i) : undefined}
                        onClick={() => onCardClick?.(i)}
                        className={`${cardTypeClass}`}
                        style={{
                            width: '144px',
                            aspectRatio: '2/3',
                            borderRadius: '4px',
                            border: '2px solid rgba(148, 163, 184, 0.5)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                            transform: isSelected ? 'translateY(-20%)' : 'translateY(30%)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            marginLeft: i === 0 ? 0 : '-10px',
                            zIndex: isSelected ? 20 : 10,
                            position: 'relative',
                            overflow: 'hidden',
                            flexShrink: 0,
                            outline: isSelected ? '3px solid #FFD700' : 'none',
                            outlineOffset: '2px',
                            animationDelay: isDrawing ? `${(i - (drawStartIndex ?? 0)) * 150}ms` : '0ms',
                        }}
                        onMouseEnter={e => {
                            if (!isSelected) e.currentTarget.style.transform = 'translateY(0%)';
                        }}
                        onMouseLeave={e => {
                            if (!isSelected) e.currentTarget.style.transform = 'translateY(30%)';
                        }}
                    >
                        <div className="card-inner-border" />
                        <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', height: '100%', color: 'white', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
                            <div style={{ fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '4px', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {card.name}
                            </div>
                            <div style={{ flex: 1, fontSize: '7px', fontFamily: 'monospace', lineHeight: 1.4, opacity: 0.8, overflow: 'hidden', background: 'rgba(0,0,0,0.2)', borderRadius: '2px', padding: '3px' }}>
                                {card.effectText}
                            </div>
                            {card.atk !== undefined && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '9px', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: '#FFD700' }}>A:{card.atk}</span>
                                    <span style={{ color: '#60a5fa' }}>D:{card.def}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Hand;
