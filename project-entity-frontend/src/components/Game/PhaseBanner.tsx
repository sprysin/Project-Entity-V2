import React, { useEffect, useState } from 'react';
import type { GamePhase } from '../../types';

interface PhaseBannerProps {
    oldPhase: GamePhase | null;
    newPhase: GamePhase;
    /** Called when animation completes. */
    onComplete: () => void;
}

const PHASE_LABELS: Record<string, string> = {
    Draw: 'DRAW PHASE',
    Standby: 'STANDBY PHASE',
    Main1: 'MAIN PHASE 1',
    Battle: 'BATTLE PHASE',
    Main2: 'MAIN PHASE 2',
    End: 'END PHASE',
};

const PhaseBanner: React.FC<PhaseBannerProps> = ({ oldPhase, newPhase, onComplete }) => {
    const [stage, setStage] = useState<'enter' | 'hold' | 'exit'>('enter');

    useEffect(() => {
        // Enter → hold → exit → complete
        const enterTimer = setTimeout(() => setStage('hold'), 300);
        const exitTimer = setTimeout(() => setStage('exit'), 900);
        const completeTimer = setTimeout(() => onComplete(), 1200);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    const oldLabel = oldPhase ? PHASE_LABELS[oldPhase] ?? oldPhase : '';
    const newLabel = PHASE_LABELS[newPhase] ?? newPhase;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            pointerEvents: 'none',
        }}>
            {/* Dark band */}
            <div style={{
                width: '100%',
                padding: '24px 0',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.85) 80%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                overflow: 'hidden',
                opacity: stage === 'enter' ? 0 : stage === 'exit' ? 0 : 1,
                transition: 'opacity 0.3s ease',
            }}>
                {/* Old phase sliding out */}
                {oldLabel && (
                    <div style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-header)',
                        letterSpacing: '4px',
                        color: '#64748b',
                        fontWeight: 'bold',
                        transform: stage === 'enter' ? 'translateX(0)' : 'translateX(-120%)',
                        opacity: stage === 'enter' ? 1 : 0,
                        transition: 'transform 0.4s ease, opacity 0.3s ease',
                    }}>
                        {oldLabel}
                    </div>
                )}

                {/* New phase sliding in */}
                <div style={{
                    fontSize: '22px',
                    fontFamily: 'var(--font-header)',
                    letterSpacing: '6px',
                    fontWeight: 'bold',
                    color: '#FFD700',
                    textShadow: '0 0 20px rgba(255,215,0,0.4)',
                    transform: stage === 'enter' ? 'translateX(120%)' : 'translateX(0)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    {newLabel}
                </div>

                {/* Decorative line */}
                <div style={{
                    width: stage === 'hold' ? '200px' : '0px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                    marginTop: '8px',
                    transition: 'width 0.5s ease',
                }} />
            </div>
        </div>
    );
};

export default PhaseBanner;
