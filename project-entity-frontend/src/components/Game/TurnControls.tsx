import React from 'react';
import { GamePhase } from '../../types';

interface TurnControlsProps {
    turn: number;
    activePlayer: number;
    currentPhase: GamePhase;
    onNextPhase: () => void;
    isMirrorMode: boolean; // Used to determine color if needed, or pass colors directly
}

const TurnControls: React.FC<TurnControlsProps> = ({ turn, activePlayer, currentPhase, onNextPhase }) => {
    // Determine colors based on active activePlayer logic (P1 = 0 = Black/White text, P2 = 1 = White/Black text)
    // Actually, let's keep it simple and just use the same logic as GameField or accept props.
    // For now, I'll replicate the logic: P1 active -> White Text context (bg is black). P2 active -> Black Text context (bg is white).

    const isP1Active = activePlayer === 0;
    const textColor = isP1Active ? 'white' : 'black';
    const subTextColor = isP1Active ? '#64748b' : '#94a3b8';
    const bgColor = isP1Active ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';

    return (
        <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            zIndex: 30,
        }}>
            {/* Turn info */}
            <div style={{
                background: bgColor,
                border: '1px solid rgba(128,128,128,0.3)',
                padding: '8px 16px',
                backdropFilter: 'blur(12px)',
                textAlign: 'right',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: subTextColor, letterSpacing: '3px' }}>TURN</span>
                    <span style={{ fontSize: '20px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: textColor, lineHeight: 1 }}>{turn}</span>
                </div>
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: '#FFD700', letterSpacing: '2px', marginTop: '4px' }}>
                    PLAYER {activePlayer + 1}'S TURN
                </div>
            </div>

            {/* Next Phase button */}
            <button
                onClick={onNextPhase}
                disabled={['Draw', 'Standby', 'End'].includes(currentPhase)}
                style={{
                    padding: '8px 16px',
                    background: ['Draw', 'Standby', 'End'].includes(currentPhase) ? '#94a3b8' : '#ca8a04',
                    border: 'none',
                    color: 'white',
                    fontFamily: 'var(--font-header)',
                    fontWeight: 'bold',
                    cursor: ['Draw', 'Standby', 'End'].includes(currentPhase) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 20px rgba(202,138,4,0.3)',
                    transition: 'background 0.2s ease',
                    opacity: ['Draw', 'Standby', 'End'].includes(currentPhase) ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                    if (!['Draw', 'Standby', 'End'].includes(currentPhase)) e.currentTarget.style.background = '#eab308';
                }}
                onMouseLeave={e => {
                    if (!['Draw', 'Standby', 'End'].includes(currentPhase)) e.currentTarget.style.background = '#ca8a04';
                }}
            >
                <span style={{ fontSize: '14px', letterSpacing: '1px', whiteSpace: 'nowrap', lineHeight: 1 }}>
                    {currentPhase === 'Main1' ? 'ENTER BATTLE' :
                        currentPhase === 'Battle' ? 'END BATTLE' :
                            currentPhase === 'Main2' ? 'END TURN' :
                                'NEXT PHASE'}
                </span>
                <span style={{ fontSize: '9px', opacity: 0.9, letterSpacing: '2px', fontStyle: 'italic', marginTop: '2px' }}>({currentPhase})</span>
            </button>
        </div>
    );
};

export default TurnControls;
