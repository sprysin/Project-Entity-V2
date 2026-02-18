import React from 'react';

interface PileProps {
    count: number;
    label: string;
    color?: 'slate' | 'purple';
    isFlashing?: boolean;
    onClick?: () => void;
    domRef?: (el: HTMLElement | null) => void;
}

// Discard / Void pile
export const Pile: React.FC<PileProps> = ({ count, label, color = 'slate', isFlashing, onClick, domRef }) => {
    const borderColor = color === 'purple' ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255,255,255,0.1)';
    const bgColor = color === 'purple' ? 'rgba(88, 28, 135, 0.3)' : 'rgba(15, 23, 42, 0.4)';

    // SVG icons
    const Icon = () => color === 'purple' ? (
        // Void / hurricane icon
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white" style={{ opacity: 0.6 }}>
            <path d="M6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
        </svg>
    ) : (
        // Skull / discard icon
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
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
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

// Deck pile — card back style with count
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

export default Pile;
