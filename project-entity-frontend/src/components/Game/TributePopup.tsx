import React from 'react';
import type { CardData, PlayerState } from '../../types';
import { getTributesRequired, countFieldPawns } from '../../hooks/useGameState';

interface TributePopupProps {
    /** The pawn card selected in hand that needs tributing. */
    card: CardData;
    /** Current player state (to count field pawns). */
    player: PlayerState;
    /** Slots currently selected as tributes. */
    tributeSelection: number[];
    /** Callbacks */
    onStartTribute: () => void;
    onConfirmSummon: () => void;
    onCancel: () => void;
    /** True if we're currently in tribute-select mode. */
    isTributeMode: boolean;
}

const TributePopup: React.FC<TributePopupProps> = ({
    card,
    player,
    tributeSelection,
    onStartTribute,
    onConfirmSummon,
    onCancel,
    isTributeMode,
}) => {
    const level = card.level ?? 1;
    const needed = getTributesRequired(level);
    const pawnsOnField = countFieldPawns(player);
    const canTribute = pawnsOnField >= needed; // Tribute summons are unlimited
    const tributesFilled = tributeSelection.length === needed;

    return (
        <div style={{
            background: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(202,138,4,0.6)',
            padding: '12px 16px',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeIn 0.2s ease',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-header)',
                    letterSpacing: '3px',
                    color: '#FFD700',
                    fontWeight: 'bold',
                }}>TRIBUTE SUMMON</span>
                <button
                    onClick={onCancel}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '0 4px',
                        fontFamily: 'var(--font-header)',
                    }}
                >✕</button>
            </div>

            {/* Card name */}
            <div style={{
                fontSize: '12px',
                fontFamily: 'var(--font-header)',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '1px',
            }}>{card.name}</div>

            {/* Level + requirement */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span style={{
                    fontSize: '10px',
                    color: '#94a3b8',
                    fontFamily: 'var(--font-header)',
                    letterSpacing: '1px',
                }}>LV{level}</span>
                <span style={{
                    fontSize: '10px',
                    color: canTribute ? '#FFD700' : '#ef4444',
                    fontFamily: 'var(--font-header)',
                    letterSpacing: '1px',
                    fontWeight: 'bold',
                }}>{needed} TRIBUTE{needed > 1 ? 'S' : ''} NEEDED</span>
            </div>

            {/* Progress indicator when in tribute mode */}
            {isTributeMode && (
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    justifyContent: 'center',
                    padding: '4px 0',
                }}>
                    {Array.from({ length: needed }).map((_, i) => (
                        <div key={i} style={{
                            width: '20px',
                            height: '20px',
                            border: `2px solid ${i < tributeSelection.length ? '#FFD700' : 'rgba(255,255,255,0.2)'}`,
                            background: i < tributeSelection.length ? 'rgba(202,138,4,0.3)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#FFD700',
                            transition: 'all 0.2s ease',
                        }}>
                            {i < tributeSelection.length ? '✦' : ''}
                        </div>
                    ))}
                </div>
            )}

            {/* Status text */}
            {isTributeMode && (
                <div style={{
                    fontSize: '9px',
                    color: '#94a3b8',
                    fontFamily: 'var(--font-header)',
                    letterSpacing: '2px',
                    textAlign: 'center',
                }}>
                    {tributesFilled
                        ? 'TRIBUTES SELECTED — CONFIRM'
                        : `SELECT ${needed - tributeSelection.length} MORE PAWN${needed - tributeSelection.length > 1 ? 'S' : ''} ON YOUR FIELD`}
                </div>
            )}

            {!canTribute ? (
                <div style={{
                    fontSize: '9px',
                    color: '#ef4444',
                    fontFamily: 'var(--font-header)',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    padding: '4px 0',
                }}>NOT ENOUGH PAWNS TO TRIBUTE</div>
            ) : !isTributeMode ? (
                /* Select Tributes button */
                <button
                    onClick={onStartTribute}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#ca8a04',
                        border: 'none',
                        color: 'white',
                        fontFamily: 'var(--font-header)',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        borderBottom: '4px solid #92400e',
                        transition: 'all 0.1s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#eab308')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#ca8a04')}
                >SELECT TRIBUTES</button>
            ) : (
                /* Confirm button (enabled only when enough tributes selected) */
                <button
                    onClick={onConfirmSummon}
                    disabled={!tributesFilled}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: tributesFilled ? '#16a34a' : '#334155',
                        border: 'none',
                        color: tributesFilled ? 'white' : '#475569',
                        fontFamily: 'var(--font-header)',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        cursor: tributesFilled ? 'pointer' : 'not-allowed',
                        borderBottom: `4px solid ${tributesFilled ? '#14532d' : '#1e293b'}`,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { if (tributesFilled) e.currentTarget.style.background = '#22c55e'; }}
                    onMouseLeave={e => { if (tributesFilled) e.currentTarget.style.background = '#16a34a'; }}
                >CONFIRM SUMMON</button>
            )}
        </div>
    );
};

export default TributePopup;
