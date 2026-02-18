import React, { useState } from 'react';
import PlayerField from '../components/Game/PlayerField';
import Hand from '../components/Game/Hand';

interface GameFieldProps {
    gameMode: 'mirror' | 'solo';
    onExit: () => void;
}

const GameField: React.FC<GameFieldProps> = ({ gameMode, onExit }) => {
    // Mock State for Turn/Phase
    const [turn, setTurn] = useState(1);
    const [phase, setPhase] = useState('MAIN 1');
    const [p1LP, setP1LP] = useState(800);
    const [p2LP, setP2LP] = useState(800);

    return (
        <div className="game-field" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#050505', // Deep dark background
            color: 'white',
            position: 'relative',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            {/* EXIT BUTTON */}
            <button
                onClick={onExit}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 100,
                    padding: '5px 10px',
                    background: 'rgba(255,0,0,0.2)',
                    border: '1px solid red',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                EXIT GAME
            </button>

            {/* OPPONENT FIELD (Top) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', transform: 'rotate(180deg)' }}>
                <PlayerField player="p2" isMirrored={true} />
                <div style={{ marginTop: '-20px' }}> {/* Negative margin to pull it closer/overlap if needed */}
                    <Hand isOpponent={true} />
                </div>
            </div>

            {/* MIDDLE INFO BAR */}
            <div style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 50px',
                background: 'rgba(255, 215, 0, 0.05)',
                borderTop: '1px solid rgba(255, 215, 0, 0.2)',
                borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>PLAYER 2</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{p2LP} LP</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>TURN {turn}</div>
                    <div style={{ color: 'var(--color-accent)' }}>PLAYER 1'S TURN</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{p1LP} LP</span>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>PLAYER 1</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="primary" style={{ fontSize: '0.9rem', padding: '5px 15px' }}>
                        NEXT PHASE <br />
                        <span style={{ fontSize: '0.7em' }}>({phase})</span>
                    </button>
                    <button style={{ fontSize: '1.2rem' }}> &gt; </button>
                </div>

            </div>

            {/* PLAYER FIELD (Bottom) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <PlayerField player="p1" isMirrored={false} />
            </div>

            {/* PLAYER HAND CONTAINER */}
            <div style={{
                position: 'fixed',
                bottom: '0',
                left: '0',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 100,
                pointerEvents: 'none'
            }}>
                <div style={{ pointerEvents: 'auto', marginBottom: '-20px' }}>
                    <Hand />
                </div>
            </div>

            {/* SYSTEM LOG (Placeholder) */}
            <div style={{
                position: 'absolute',
                right: '20px',
                top: '100px',
                width: '250px',
                height: '200px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid #333',
                fontSize: '0.8rem',
                padding: '10px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                pointerEvents: 'none'
            }}>
                <div style={{ color: 'var(--color-accent)', marginBottom: '5px' }}>// SYSTEM LOG</div>
                <div>Duel Initialized.</div>
            </div>

        </div>
    );
};

export default GameField;
