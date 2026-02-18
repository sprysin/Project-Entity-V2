import React from 'react';

interface ZoneProps {
    type: 'Pawn' | 'Action' | 'Deck' | 'Grave' | 'Void';
    label?: string;
    count?: number;
}

const Zone: React.FC<ZoneProps> = ({ type, label, count }) => {
    // Determine colors/icons based on type
    const getBorderColor = () => {
        switch (type) {
            case 'Pawn': return 'rgba(255, 215, 0, 0.3)'; // Gold-ish
            case 'Action': return 'rgba(0, 255, 127, 0.2)'; // Green-ish
            case 'Deck': return 'rgba(255, 255, 255, 0.5)';
            case 'Grave': return 'rgba(128, 0, 128, 0.4)'; // Purple
            case 'Void': return 'rgba(75, 0, 130, 0.6)'; // Indigo
            default: return '#333';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'Pawn': return '♟';
            case 'Action': return '%';
            case 'Grave': return '💀';
            case 'Void': return '🌀';
            default: return '';
        }
    };

    return (
        <div className="game-zone" style={{
            width: '100px',
            height: '140px',
            border: `1px solid ${getBorderColor()}`,
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'white'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = getBorderColor();
            }}
        >
            {/* Center Icon/Text */}
            <div style={{ fontSize: '2rem', opacity: 1 }}>
                {getIcon()}
            </div>

            <div style={{ fontSize: '0.7rem', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {label || type}
            </div>

            {/* Deck Count or Stack Effect */}
            {count !== undefined && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 0 5px black'
                }}>
                    {count > 0 ? count : ''}
                </div>
            )}
        </div>
    );
};

export default Zone;
