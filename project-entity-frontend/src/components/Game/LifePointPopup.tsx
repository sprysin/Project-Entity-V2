import React, { useEffect, useState } from 'react';

interface DamagePopupProps {
    amount: number;
    side: 'top' | 'bottom';
    onComplete: () => void;
}

const DamagePopup: React.FC<DamagePopupProps> = ({ amount, side, onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 300); // Allow fade out
        }, 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'absolute',
            [side === 'top' ? 'top' : 'bottom']: '80px', // Near LP bars
            [side === 'top' ? 'left' : 'right']: '20%', // Offset slightly
            transform: 'translateX(-50%)',
            color: '#ef4444',
            fontSize: '48px',
            fontWeight: '900',
            fontFamily: 'var(--font-header)',
            textShadow: '0 0 10px rgba(0,0,0,0.8), 2px 2px 0px rgba(0,0,0,1)',
            pointerEvents: 'none',
            zIndex: 100,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 1.5s ease-out',
            animation: 'floatUp 1.5s ease-out forwards',
        }}>
            -{amount}
            <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(0.8); opacity: 0; }
                    10% { transform: translateY(-20px) scale(1.2); opacity: 1; }
                    100% { transform: translateY(-80px) scale(1); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default DamagePopup;
