import React, { useState } from 'react';
import PlayerField from '../components/Game/PlayerField';
import Hand from '../components/Game/Hand';

interface GameFieldProps {
    gameMode?: 'mirror' | 'solo';
    onExit: () => void;
}

// Mock game log entries
const INITIAL_LOG = [
    'Duel Initialized.',
    'Player 1 draws 5 cards.',
    'Player 2 draws 5 cards.',
    'Turn 1 begins.',
];

const PHASES = ['MAIN 1', 'BATTLE', 'MAIN 2', 'END'];

const GameField: React.FC<GameFieldProps> = ({ gameMode = 'solo', onExit }) => {
    const [turn, setTurn] = useState(1);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [p1LP] = useState(800);
    const [p2LP] = useState(800);
    const [log] = useState<string[]>(INITIAL_LOG);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);

    const currentPhase = PHASES[phaseIndex];

    const handleNextPhase = () => {
        if (phaseIndex < PHASES.length - 1) {
            setPhaseIndex(p => p + 1);
        } else {
            setPhaseIndex(0);
            setTurn(t => t + 1);
        }
    };

    return (
        <div
            className="retro-hash"
            style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                backgroundColor: '#050505',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
            }}
        >
            {/* ── MAIN PLAY AREA ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

                {/* EXIT BUTTON */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 40 }}>
                    <button
                        onClick={onExit}
                        style={{
                            padding: '8px 16px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#94a3b8',
                            fontFamily: 'var(--font-header)',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            letterSpacing: '3px',
                            backdropFilter: 'blur(12px)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(127, 29, 29, 0.8)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        ⏻ EXIT GAME
                    </button>
                </div>

                {/* PHASE / TURN CONTROLS (right side, vertically centered) */}
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
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '8px 16px',
                        backdropFilter: 'blur(12px)',
                        textAlign: 'right',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: '#64748b', letterSpacing: '3px' }}>TURN</span>
                            <span style={{ fontSize: '20px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: 'white', lineHeight: 1 }}>{turn}</span>
                        </div>
                        <div style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: '#FFD700', letterSpacing: '2px', marginTop: '4px' }}>
                            PLAYER 1'S TURN
                        </div>
                    </div>

                    {/* Next Phase button */}
                    <button
                        onClick={handleNextPhase}
                        style={{
                            padding: '8px 16px',
                            background: '#ca8a04',
                            border: 'none',
                            color: 'white',
                            fontFamily: 'var(--font-header)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: '0 4px 20px rgba(202,138,4,0.3)',
                            transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#eab308')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#ca8a04')}
                    >
                        <span style={{ fontSize: '14px', letterSpacing: '1px', whiteSpace: 'nowrap', lineHeight: 1 }}>NEXT PHASE</span>
                        <span style={{ fontSize: '9px', opacity: 0.9, letterSpacing: '2px', fontStyle: 'italic', marginTop: '2px' }}>({currentPhase})</span>
                    </button>
                </div>

                {/* ── FIELD CONTENT (centered column) ── */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingTop: '60px',
                    paddingBottom: '80px',
                }}>

                    {/* OPPONENT HAND (absolute top, card backs) */}
                    <Hand isOpponent={true} />

                    {/* OPPONENT FIELD */}
                    <div style={{ opacity: 0.9 }}>
                        <PlayerField isOpponent={true} />
                    </div>

                    {/* ── LP BAR (center divider) ── */}
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        height: '32px',
                        background: 'rgba(0,0,0,0.6)',
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
                    }}>
                        {/* Opponent LP (left) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: '#64748b', letterSpacing: '3px', textTransform: 'uppercase' }}>PLAYER 2</span>
                            <span style={{ fontSize: '20px', fontFamily: 'var(--font-header)', fontWeight: 'black', color: 'white' }}>{p2LP} LP</span>
                        </div>

                        {/* Center gradient line */}
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)', margin: '0 32px' }} />

                        {/* Player LP (right) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '20px', fontFamily: 'var(--font-header)', fontWeight: 'black', color: 'white' }}>{p1LP} LP</span>
                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', fontWeight: 'bold', color: '#64748b', letterSpacing: '3px', textTransform: 'uppercase' }}>PLAYER 1</span>
                        </div>
                    </div>

                    {/* PLAYER FIELD */}
                    <PlayerField isOpponent={false} />

                </div>

                {/* PLAYER HAND (absolute bottom, peeking up) */}
                <Hand
                    isOpponent={false}
                    selectedHandIndex={selectedHandIndex}
                    onCardClick={(i) => setSelectedHandIndex(prev => prev === i ? null : i)}
                />

            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div style={{
                width: isSidebarOpen ? '320px' : '40px',
                transition: 'width 0.3s ease',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(24px)',
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                flexShrink: 0,
            }}>
                {/* Toggle tab */}
                <button
                    onClick={() => setIsSidebarOpen(o => !o)}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '-12px',
                        transform: 'translateY(-50%)',
                        width: '24px',
                        height: '48px',
                        background: '#ca8a04',
                        border: '1px solid #FFD700',
                        borderRight: 'none',
                        borderRadius: '4px 0 0 4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        zIndex: 50,
                        padding: 0,
                        boxShadow: '-4px 0 12px rgba(0,0,0,0.5)',
                        transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#eab308')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#ca8a04')}
                >
                    {isSidebarOpen ? '›' : '‹'}
                </button>

                {isSidebarOpen ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Card Detail Panel */}
                        <div style={{ padding: '24px', paddingBottom: '8px', flexShrink: 0 }}>
                            {selectedHandIndex !== null ? (
                                // Selected card detail
                                <div style={{ animation: 'fadeIn 0.3s' }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '2/3',
                                        background: 'linear-gradient(160deg, rgba(20,15,0,0.95), rgba(10,8,0,0.95))',
                                        border: '2px solid rgba(255,215,0,0.5)',
                                        borderRadius: '4px',
                                        padding: '12px',
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        color: 'white',
                                        marginBottom: '16px',
                                    }}>
                                        <div style={{ fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '6px', marginBottom: '8px' }}>
                                            Force Fire Sparker
                                        </div>
                                        <div style={{ fontSize: '10px', fontFamily: 'monospace', lineHeight: 1.5, opacity: 0.8, flex: 1 }}>
                                            ON NORMAL SUMMON: Deal 10 damage for each set Action/Condition on opponent's field.
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '12px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ color: '#FFD700' }}>ATK: 30</span>
                                            <span style={{ color: '#60a5fa' }}>DEF: 150</span>
                                        </div>
                                    </div>
                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <button style={{
                                            width: '100%', padding: '12px',
                                            background: '#ca8a04', border: 'none', color: 'white',
                                            fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                            letterSpacing: '2px', cursor: 'pointer',
                                            borderBottom: '4px solid #92400e',
                                            transition: 'all 0.1s ease',
                                        }}>NORMAL SUMMON</button>
                                        <button style={{
                                            width: '100%', padding: '12px',
                                            background: 'rgba(30,41,59,1)', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1',
                                            fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                            letterSpacing: '2px', cursor: 'pointer',
                                        }}>SET HIDDEN</button>
                                    </div>
                                </div>
                            ) : (
                                // Empty state
                                <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, gap: '16px' }}>
                                    <div style={{ width: '64px', height: '64px', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg viewBox="0 0 24 24" width="32" height="32" fill="rgba(100,116,139,1)">
                                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,7V9H13V7H11M11,11V17H13V11H11Z" />
                                        </svg>
                                    </div>
                                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-header)', letterSpacing: '3px', color: '#475569', textAlign: 'center' }}>SELECT CARD TO VIEW...</span>
                                </div>
                            )}
                        </div>

                        {/* System Log */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px 24px', overflow: 'hidden', marginTop: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="#FFD700">
                                    <path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" />
                                </svg>
                                <span style={{ fontFamily: 'var(--font-header)', fontSize: '9px', fontWeight: 'bold', color: '#FFD700', letterSpacing: '3px' }}>SYSTEM LOG</span>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {log.map((entry, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            paddingLeft: '8px',
                                            borderLeft: `2px solid ${i === 0 ? '#FFD700' : '#1e293b'}`,
                                            paddingTop: '3px',
                                            paddingBottom: '3px',
                                            fontFamily: 'monospace',
                                            fontSize: '10px',
                                            color: i === 0 ? 'white' : '#475569',
                                            background: i === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {entry}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Collapsed sidebar
                    <div
                        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.6 }}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '9px', letterSpacing: '3px', color: '#64748b' }}>
                            System Data
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameField;
