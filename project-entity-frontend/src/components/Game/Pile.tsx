import React from 'react';
import type { CardData } from '../../types';
import PawnCard from '../PawnCard';
import UtilityCard from '../UtilityCard';

// ─── Pile (Discard / Void button on the field) ───────────────────────────────

interface PileProps {
    count: number;
    label: string;
    color?: 'slate' | 'purple';
    isFlashing?: boolean;
    onClick?: () => void;
    domRef?: (el: HTMLElement | null) => void;
}

export const Pile: React.FC<PileProps> = ({ count, label, color = 'slate', isFlashing, onClick, domRef }) => {
    const borderColor = color === 'purple' ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255,255,255,0.1)';
    const bgColor = color === 'purple' ? 'rgba(88, 28, 135, 0.3)' : 'rgba(15, 23, 42, 0.4)';

    const Icon = () => color === 'purple' ? (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white" style={{ opacity: 0.6 }}>
            <path d="M6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white" style={{ opacity: 0.6 }}>
            <path d="M12,2A9,9 0 0,0 3,11C3,14.03 4.53,16.82 7,18.47V20A1,1 0 0,0 8,21H16A1,1 0 0,0 17,20V18.46C19.47,16.81 21,14 21,11A9,9 0 0,0 12,2M9,17V19H7V17.6C5.19,16.42 4,14.34 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12C20,14.34 18.81,16.42 17,17.6V19H15V17H9M9,11A1,1 0 0,0 8,12A1,1 0 0,0 9,13A1,1 0 0,0 10,12A1,1 0 0,0 9,11M15,11A1,1 0 0,0 14,12A1,1 0 0,0 15,13A1,1 0 0,0 16,12A1,1 0 0,0 15,11Z" />
        </svg>
    );

    return (
        <div
            ref={domRef}
            onClick={onClick}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '6px' }}
        >
            <div
                className={isFlashing ? (color === 'purple' ? 'flash-purple' : 'flash-gold') : ''}
                style={{
                    width: '80px',
                    aspectRatio: '2/3',
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = color === 'purple'
                        ? '0 0 20px rgba(167,139,250,0.4)'
                        : '0 0 20px rgba(255,215,0,0.2)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
                }}
            >
                <Icon />
                <span style={{ fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '18px', color: 'white' }}>{count}</span>
            </div>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {label}
            </span>
        </div>
    );
};

// ─── DeckPile ─────────────────────────────────────────────────────────────────

export const DeckPile: React.FC<{ count: number; label?: string; domRef?: (el: HTMLElement | null) => void }> = ({ count, label = 'DECK', domRef }) => (
    <div ref={domRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div
            className="card-back"
            style={{
                width: '80px',
                aspectRatio: '2/3',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 'black', fontSize: '22px', color: 'white', textShadow: '0 0 8px rgba(0,0,0,0.8)', zIndex: 10 }}>
                {count}
            </span>
        </div>
        <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: 'white', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {label}
        </span>
    </div>
);

// ─── PileViewerModal ──────────────────────────────────────────────────────────

interface PileViewerModalProps {
    title: string;
    cards: CardData[];
    type: 'discard' | 'void';
    onClose: () => void;
}

export const PileViewerModal: React.FC<PileViewerModalProps> = ({ title, cards, type, onClose }) => {
    const isVoid = type === 'void';

    const overlayBg = isVoid
        ? 'rgba(30, 0, 60, 0.92)'
        : 'rgba(0, 0, 0, 0.88)';
    const titleColor = isVoid ? '#a78bfa' : '#FFD700';
    const titleGlow = isVoid
        ? '0 0 20px rgba(167,139,250,0.5)'
        : '0 0 20px rgba(255,215,0,0.4)';
    const borderColor = isVoid ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.1)';
    const closeBtnBg = isVoid ? 'rgba(88,28,135,0.4)' : 'rgba(127,29,29,0.4)';
    const closeBtnBorder = isVoid ? 'rgba(167,139,250,0.5)' : 'rgba(239,68,68,0.5)';
    const closeBtnHover = isVoid ? 'rgba(109,40,217,0.7)' : 'rgba(153,27,27,0.7)';

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                inset: 0,
                background: overlayBg,
                backdropFilter: 'blur(16px)',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                padding: '48px',
                animation: 'fadeInModal 0.2s ease',
            }}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${borderColor}`,
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Icon */}
                    {isVoid ? (
                        <svg viewBox="0 0 24 24" width="36" height="36" fill={titleColor} style={{ filter: `drop-shadow(${titleGlow})` }}>
                            <path d="M6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="36" height="36" fill={titleColor} style={{ filter: `drop-shadow(${titleGlow})` }}>
                            <path d="M12,2A9,9 0 0,0 3,11C3,14.03 4.53,16.82 7,18.47V20A1,1 0 0,0 8,21H16A1,1 0 0,0 17,20V18.46C19.47,16.81 21,14 21,11A9,9 0 0,0 12,2M9,17V19H7V17.6C5.19,16.42 4,14.34 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12C20,14.34 18.81,16.42 17,17.6V19H15V17H9M9,11A1,1 0 0,0 8,12A1,1 0 0,0 9,13A1,1 0 0,0 10,12A1,1 0 0,0 9,11M15,11A1,1 0 0,0 14,12A1,1 0 0,0 15,13A1,1 0 0,0 16,12A1,1 0 0,0 15,11Z" />
                        </svg>
                    )}
                    <div>
                        <h2 style={{
                            fontFamily: 'var(--font-header)',
                            fontWeight: 'black',
                            fontSize: '28px',
                            color: titleColor,
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            textShadow: titleGlow,
                            margin: 0,
                        }}>
                            {title}
                        </h2>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-header)', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', marginTop: '4px' }}>
                            {cards.length} {cards.length === 1 ? 'CARD' : 'CARDS'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        padding: '12px 32px',
                        background: closeBtnBg,
                        border: `1px solid ${closeBtnBorder}`,
                        color: 'white',
                        fontFamily: 'var(--font-header)',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = closeBtnHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = closeBtnBg)}
                >
                    CLOSE VIEW
                </button>
            </div>

            {/* Card Grid */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: '8px',
            }}>
                {cards.length === 0 ? (
                    // Empty state
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        opacity: 0.3,
                    }}>
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="white">
                            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                        </svg>
                        <span style={{ fontFamily: 'var(--font-header)', fontSize: '12px', letterSpacing: '4px', color: 'white' }}>
                            CONTAINS NO CARDS
                        </span>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '24px',
                        padding: '8px 4px',
                    }}>
                        {cards.map((card, i) => (
                            <div
                                key={card.id + i}
                                style={{
                                    transition: 'transform 0.2s ease, filter 0.2s ease',
                                    cursor: 'default',
                                    // Void cards are slightly desaturated to show they're removed from play
                                    filter: isVoid ? 'saturate(0.6) brightness(0.8)' : 'none',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                                    e.currentTarget.style.filter = 'none';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                    e.currentTarget.style.filter = isVoid ? 'saturate(0.6) brightness(0.8)' : 'none';
                                }}
                            >
                                {card.cardFamily === 'Pawn' ? (
                                    <PawnCard
                                        name={card.name}
                                        level={card.level}
                                        attribute={card.attribute}
                                        pawnType={card.pawnType}
                                        effectText={card.effectText}
                                        attack={card.attack}
                                        defense={card.defense}
                                    />
                                ) : (
                                    <UtilityCard
                                        name={card.name}
                                        type={card.type}
                                        subType={card.subType}
                                        effectText={card.effectText}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pile;
