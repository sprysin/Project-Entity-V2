import React from 'react';

interface GameInfoBarProps {
    p1LP: number;
    p2LP: number;
    topPlayerIndex: number;
    bottomPlayerIndex: number;
    activePlayerIndex: number;
}

const GameInfoBar: React.FC<GameInfoBarProps> = ({
    p1LP,
    p2LP,
    topPlayerIndex,
    bottomPlayerIndex,
    activePlayerIndex
}) => {
    // Current active player index determines color scheme
    const textColor = activePlayerIndex === 0 ? 'white' : 'black';
    const subTextColor = activePlayerIndex === 0 ? '#64748b' : '#94a3b8';

    return (
        <div style={{
            width: '100%',
            maxWidth: '900px',
            height: '32px',
            background: activePlayerIndex === 0 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 64px',
            margin: '8px 0',
            position: 'relative',
            zIndex: 0,
            boxSizing: 'border-box',
            transition: 'background 0.5s ease',
        }}>
            {/* Opponent LP (left) - displaying Top Player */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: subTextColor, letterSpacing: '3px', textTransform: 'uppercase' }}>PLAYER {topPlayerIndex + 1}</span>
                <span style={{ fontSize: '20px', fontFamily: 'var(--font-header)', fontWeight: 'black', color: textColor }}>{p2LP} LP</span>
            </div>

            {/* Center gradient line */}
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(128,128,128,0.4), transparent)', margin: '0 32px' }} />

            {/* Player LP (right) - displaying Bottom Player */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '20px', fontFamily: 'var(--font-header)', fontWeight: 'black', color: textColor }}>{p1LP} LP</span>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: subTextColor, letterSpacing: '3px', textTransform: 'uppercase' }}>PLAYER {bottomPlayerIndex + 1}</span>
            </div>
        </div>
    );
};

export default GameInfoBar;
