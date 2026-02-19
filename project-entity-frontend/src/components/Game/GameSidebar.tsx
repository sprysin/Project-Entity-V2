import React from 'react';
import type { CardData, GamePhase } from '../../types';
import PawnCard from '../PawnCard';
import UtilityCard from '../UtilityCard';
import { getTributesRequired } from '../../hooks/useGameState';

interface GameSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedCard: CardData | null;
    activePlayerIndex: number;
    // Actions
    onSummon: (isHidden: boolean) => void;
    onActivateFromHand: () => void;
    onActivateFromField: () => void;
    onSet: () => void;
    onAttack: () => void;
    interactionContext: 'hand' | 'field' | null;
    currentTurn: number;
    currentPhase: GamePhase;
}

const SIDEBAR_CARD_SCALE = 260 / 223;

const GameSidebar: React.FC<GameSidebarProps> = ({
    isOpen,
    onToggle,
    selectedCard,
    onSummon,
    onActivateFromHand,
    onActivateFromField,
    onSet,
    onAttack,
    interactionContext,
    currentTurn,
    currentPhase,
}) => {
    // Check if a field Condition can be activated (must wait 1 full turn)
    const canActivateCondition = selectedCard?.type === 'Condition'
        && selectedCard.turnSetOn !== undefined
        && (currentTurn - selectedCard.turnSetOn) >= 2;

    const isMainPhase = currentPhase === 'Main1' || currentPhase === 'Main2';
    const isBattlePhase = currentPhase === 'Battle';

    return (
        <div style={{
            width: isOpen ? '320px' : '40px',
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
                onClick={onToggle}
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
                {isOpen ? '›' : '‹'}
            </button>

            {isOpen ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Card Detail Panel */}
                    <div style={{ padding: '16px', paddingBottom: '8px', flexShrink: 0 }}>
                        {selectedCard ? (
                            <div style={{ animation: 'fadeIn 0.3s' }}>
                                {/* Card scaled to fit sidebar */}
                                <div style={{
                                    transformOrigin: 'top center',
                                    transform: `scale(${SIDEBAR_CARD_SCALE})`,
                                    marginBottom: `${Math.round(325 * SIDEBAR_CARD_SCALE - 325)}px`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    {selectedCard.cardFamily === 'Pawn' ? (
                                        <PawnCard
                                            name={selectedCard.name}
                                            level={selectedCard.level ?? 1}
                                            attribute={(selectedCard.attribute as any) ?? 'Light'}
                                            pawnType={selectedCard.pawnType ?? 'Warrior'}
                                            effectText={selectedCard.effectText}
                                            attack={selectedCard.attack ?? 0}
                                            defense={selectedCard.defense ?? 0}
                                        />
                                    ) : (
                                        <UtilityCard
                                            name={selectedCard.name}
                                            type={(selectedCard.type as any) ?? 'Action'}
                                            subType={(selectedCard.subType as any) ?? 'Normal'}
                                            effectText={selectedCard.effectText}
                                        />
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '90px' }}>
                                    {interactionContext === 'hand' && isMainPhase && (
                                        <>
                                            {selectedCard.cardFamily === 'Pawn' ? (
                                                <>
                                                    {/* Only show NORMAL SUMMON for Lv1-4. Lv5+ uses TributePopup. */}
                                                    {getTributesRequired(selectedCard.level ?? 1) === 0 && (
                                                        <button
                                                            onClick={() => onSummon(false)}
                                                            style={{
                                                                width: '100%', padding: '12px',
                                                                background: '#ca8a04', border: 'none', color: 'white',
                                                                fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                                                letterSpacing: '2px', cursor: 'pointer',
                                                                borderBottom: '4px solid #92400e',
                                                                transition: 'all 0.1s ease',
                                                            }}
                                                            onMouseEnter={e => (e.currentTarget.style.background = '#eab308')}
                                                            onMouseLeave={e => (e.currentTarget.style.background = '#ca8a04')}
                                                        >NORMAL SUMMON</button>
                                                    )}
                                                    <button
                                                        onClick={() => onSummon(true)}
                                                        style={{
                                                            width: '100%', padding: '12px',
                                                            background: 'rgba(30,41,59,1)', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1',
                                                            fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                                            letterSpacing: '2px', cursor: 'pointer',
                                                        }}>SET HIDDEN</button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Utility cards from hand */}
                                                    {/* Normal Actions can be activated from hand */}
                                                    {selectedCard.type === 'Action' && (
                                                        <button
                                                            onClick={onActivateFromHand}
                                                            style={{
                                                                width: '100%', padding: '12px',
                                                                background: '#16a34a', border: 'none', color: 'white',
                                                                fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                                                letterSpacing: '2px', cursor: 'pointer',
                                                                borderBottom: '4px solid #14532d',
                                                                transition: 'all 0.1s ease',
                                                            }}
                                                            onMouseEnter={e => (e.currentTarget.style.background = '#22c55e')}
                                                            onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}
                                                        >ACTIVATE ACTION</button>
                                                    )}
                                                    {/* Conditions cannot be activated from hand — only SET */}
                                                    <button
                                                        onClick={onSet}
                                                        style={{
                                                            width: '100%', padding: '12px',
                                                            background: 'rgba(30,41,59,1)', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1',
                                                            fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                                            letterSpacing: '2px', cursor: 'pointer',
                                                        }}>SET CARD</button>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {interactionContext === 'field' && (
                                        <>
                                            {selectedCard.cardFamily === 'Utility' && selectedCard.isFaceDown && isMainPhase && (
                                                <>
                                                    {selectedCard.type === 'Action' && (
                                                        <button
                                                            onClick={onActivateFromField}
                                                            style={{
                                                                width: '100%', padding: '12px',
                                                                background: '#16a34a', border: 'none', color: 'white',
                                                                fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                                                letterSpacing: '2px', cursor: 'pointer',
                                                                borderBottom: '4px solid #14532d',
                                                                transition: 'all 0.1s ease',
                                                            }}
                                                            onMouseEnter={e => (e.currentTarget.style.background = '#22c55e')}
                                                            onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}
                                                        >ACTIVATE ACTION</button>
                                                    )}
                                                    {selectedCard.type === 'Condition' && (
                                                        <button
                                                            onClick={onActivateFromField}
                                                            disabled={!canActivateCondition}
                                                            style={{
                                                                width: '100%', padding: '12px',
                                                                background: canActivateCondition ? '#7c3aed' : '#334155',
                                                                border: 'none',
                                                                color: canActivateCondition ? 'white' : '#475569',
                                                                fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                                                letterSpacing: '2px',
                                                                cursor: canActivateCondition ? 'pointer' : 'not-allowed',
                                                                borderBottom: `4px solid ${canActivateCondition ? '#4c1d95' : '#1e293b'}`,
                                                                transition: 'all 0.1s ease',
                                                            }}
                                                            onMouseEnter={e => { if (canActivateCondition) e.currentTarget.style.background = '#8b5cf6'; }}
                                                            onMouseLeave={e => { if (canActivateCondition) e.currentTarget.style.background = '#7c3aed'; }}
                                                        >
                                                            {canActivateCondition ? 'ACTIVATE CONDITION' : 'MUST WAIT 1 TURN'}
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            {selectedCard.cardFamily === 'Utility' && !selectedCard.isFaceDown && (
                                                <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '10px', color: '#94a3b8', fontFamily: 'var(--font-header)', letterSpacing: '2px' }}>
                                                    CARD ACTIVE
                                                </div>
                                            )}
                                            {selectedCard.cardFamily === 'Pawn' && (
                                                <>
                                                    <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '10px', color: '#94a3b8', fontFamily: 'var(--font-header)', letterSpacing: '2px', marginBottom: '8px' }}>
                                                        PAWN ON FIELD
                                                    </div>
                                                    {/* Attack Button */}
                                                    {isBattlePhase && !selectedCard.hasAttacked && (selectedCard.currentPosition === 'Attack') && (
                                                        <button
                                                            onClick={onAttack}
                                                            style={{
                                                                width: '100%', padding: '12px',
                                                                background: '#dc2626', border: 'none', color: 'white',
                                                                fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px',
                                                                letterSpacing: '2px', cursor: 'pointer',
                                                                borderBottom: '4px solid #991b1b',
                                                                transition: 'all 0.1s ease',
                                                                animation: 'pulse 2s infinite',
                                                            }}
                                                            onMouseEnter={e => (e.currentTarget.style.background = '#ef4444')}
                                                            onMouseLeave={e => (e.currentTarget.style.background = '#dc2626')}
                                                        >ATTACK</button>
                                                    )}
                                                    {selectedCard.hasAttacked && (
                                                        <div style={{ textAlign: 'center', color: '#ef4444', fontSize: '10px', fontFamily: 'var(--font-header)', letterSpacing: '2px', fontWeight: 'bold' }}>
                                                            ALREADY ATTACKED
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
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
                </div>
            ) : (
                // Collapsed sidebar
                <div
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.6 }}
                    onClick={onToggle}
                >
                    <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '9px', letterSpacing: '3px', color: '#64748b' }}>
                        System Data
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameSidebar;
