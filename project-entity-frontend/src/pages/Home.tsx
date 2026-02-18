import React from 'react';

interface HomeProps {
    onNavigate: (page: 'home' | 'database') => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            zIndex: 10,
            position: 'relative',
            textAlign: 'center'
        }}>
            {/* GLOWING HEADER */}
            <h1 style={{
                fontSize: '4rem',
                color: 'var(--color-accent)',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.4)',
                letterSpacing: '0.2rem',
                marginBottom: '0.5rem'
            }}>
                PROJECT ENTITY
            </h1>

            <h2 style={{
                fontSize: '1.2rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '4rem',
                fontWeight: 'normal',
                letterSpacing: '0.5rem'
            }}>
                TACTICAL CARD FRAMEWORK
            </h2>

            {/* MENU BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px' }}>
                <button className="primary" onClick={() => alert("Game Loop not connected yet!")}>
                    PLAY TEST GAME
                </button>

                <button onClick={() => onNavigate('database')}>
                    CARD DATABASE
                </button>

                <button onClick={() => alert("Rules coming soon!")}>
                    GAME RULES
                </button>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '2rem',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-mono)'
            }}>
                SYSTEM VERSION 0.1.1-ALPHA
            </div>
        </div>
    );
};

export default Home;
