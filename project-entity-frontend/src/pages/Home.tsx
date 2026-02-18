import React from 'react';

interface HomeProps {
    onNavigate: (page: 'home' | 'database' | 'game-mirror' | 'game-solo') => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    const [showGameModes, setShowGameModes] = React.useState(false);
    return (
        <div className="retro-hash" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Gradient Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, black, transparent, black)',
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            {/* BRANDING HEADER */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '6rem', // text-8xl equivalent roughly
                    color: '#eab308', // yellow-500
                    textShadow: '0 0 30px rgba(234,179,8,0.5)',
                    fontFamily: 'var(--font-header)',
                    fontWeight: 'bold',
                    letterSpacing: '-2px', // tracking-tighter
                    lineHeight: 1,
                    marginBottom: '1rem'
                }}>
                    PROJECT ENTITY
                </h1>
                <p style={{
                    fontSize: '1.25rem', // text-xl
                    color: '#94a3b8', // slate-400
                    fontFamily: 'var(--font-main)',
                    fontWeight: 300, // light
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase'
                }}>
                    Tactical Card Framework
                </p>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                width: '300px'
            }}>
                {!showGameModes ? (
                    <button
                        className="btn-shine-container"
                        onClick={() => setShowGameModes(true)}
                    >
                        <div className="btn-shine-effect"></div>
                        PLAY TEST GAME
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeIn 0.3s' }}>
                        <button className="btn-shine-container" style={{ padding: '0.8rem 1rem', fontSize: '0.9rem' }} onClick={() => onNavigate('game-mirror')}>
                            <div className="btn-shine-effect"></div>
                            PLAY MIRROR (2P)
                        </button>
                        <button className="btn-shine-container" style={{ padding: '0.8rem 1rem', fontSize: '0.9rem' }} onClick={() => onNavigate('game-solo')}>
                            <div className="btn-shine-effect"></div>
                            PLAY SOLO (1P)
                        </button>
                        <button className="btn-glass" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem' }} onClick={() => setShowGameModes(false)}>
                            BACK
                        </button>
                    </div>
                )}

                <button
                    className="btn-glass"
                    onClick={() => onNavigate('database')}
                >
                    CARD DATABASE
                </button>

                <button
                    className="btn-glass"
                    onClick={() => alert("Rules coming soon!")}
                >
                    GAME RULES
                </button>
            </div>

            {/* FOOTER */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#475569', // slate-600
                fontFamily: 'var(--font-header)'
            }}>
                <div style={{ width: '3rem', height: '1px', background: '#1e293b' }}></div> {/* slate-800 */}
                <span>SYSTEM VERSION 0.1.1-ALPHA</span>
                <div style={{ width: '3rem', height: '1px', background: '#1e293b' }}></div>
            </div>

        </div>
    );
};

export default Home;
