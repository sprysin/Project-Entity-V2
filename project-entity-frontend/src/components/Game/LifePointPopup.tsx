import React, { useEffect, useState } from 'react';

interface LifePointPopupProps {
    amount: number;
    type: 'damage' | 'gain';
    onComplete: () => void;
}

const LifePointPopup: React.FC<LifePointPopupProps> = ({ amount, type, onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 300); // Allow fade out
        }, 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const color = type === 'damage' ? '#ef4444' : '#22c55e';
    const label = type === 'damage' ? `-${amount}` : `+${amount}`;

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            color: color,
            fontSize: '84px',
            fontWeight: '900',
            fontFamily: 'var(--font-header)',
            textShadow: '0 0 30px rgba(0,0,0,0.9), 6px 6px 0px rgba(0,0,0,1)',
            pointerEvents: 'none',
            zIndex: 1000,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            animation: 'floatUpAndCenter 1.5s ease-out forwards',
        }}>
            {label}
            <style>{`
                @keyframes floatUpAndCenter {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    15% { transform: translate(-50%, -60%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -150%) scale(1); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default LifePointPopup;
