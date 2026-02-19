import React, { useEffect, useState, useRef, useCallback } from 'react';
import PlayerField from '../components/Game/PlayerField';
import Hand from '../components/Game/Hand';
import { PileViewerModal } from '../components/Game/Pile';
import { useGameState, getTributesRequired } from '../hooks/useGameState';
import GameSidebar from '../components/Game/GameSidebar';
import TurnControls from '../components/Game/TurnControls';
import GameInfoBar from '../components/Game/GameInfoBar';
import TributePopup from '../components/Game/TributePopup';
import PhaseBanner from '../components/Game/PhaseBanner';
import LifePointPopup from '../components/Game/LifePointPopup';
import type { CardData } from '../types';
import type { GamePhase } from '../types';


interface GameFieldProps {
    gameMode?: 'mirror' | 'solo';
    onExit: () => void;
}

type InteractionMode = 'IDLE' | 'SELECT_ZONE_SUMMON' | 'SELECT_ZONE_SET_PAWN' | 'SELECT_ZONE_SET_UTILITY' | 'SELECT_TARGET' | 'SELECT_TRIBUTE';

const GameField: React.FC<GameFieldProps> = ({ gameMode = 'solo', onExit }) => {
    const {
        gameState, initializeGame, nextPhase, summonPawn, setCard,
        activateCard, declareAttack, resolveActivation, error
    } = useGameState();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Selection State
    const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
    const [selectedFieldSlot, setSelectedFieldSlot] = useState<{ player: number, slot: number, type: 'pawn' | 'utility' } | null>(null);
    const [interactionMode, setInteractionMode] = useState<InteractionMode>('IDLE');
    const [tributeSelection, setTributeSelection] = useState<number[]>([]);

    // Phase banner
    const [phaseBanner, setPhaseBanner] = useState<{ oldPhase: GamePhase | null, newPhase: GamePhase } | null>(null);
    const prevPhaseRef = useRef<GamePhase | null>(null);

    // Pile viewer
    const [viewingPile, setViewingPile] = useState<'discard' | 'void' | null>(null);

    // Initialize
    useEffect(() => { initializeGame(); }, [initializeGame]);

    // Phase change detection → trigger banner
    useEffect(() => {
        if (gameState.players.length === 0) return; // Not initialized
        const currentPhase = gameState.currentPhase;
        if (prevPhaseRef.current !== null && prevPhaseRef.current !== currentPhase) {
            setPhaseBanner({ oldPhase: prevPhaseRef.current, newPhase: currentPhase });
        }
        prevPhaseRef.current = currentPhase;
    }, [gameState.currentPhase, gameState.players.length]);

    // Activation linger timeout
    useEffect(() => {
        if (gameState.activatingCard) {
            const timer = setTimeout(() => {
                resolveActivation();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState.activatingCard, resolveActivation]);

    // Derived State
    const activePlayerIndex = gameState.activePlayerIndex;
    const isMirrorMode = gameMode === 'mirror';
    const bottomPlayerIndex = isMirrorMode ? activePlayerIndex : 0;
    const topPlayerIndex = bottomPlayerIndex === 0 ? 1 : 0;

    // Safety check for players array
    const EMPTY_PLAYER = { hand: [], field: { pawns: Array(5).fill(null), utility: Array(5).fill(null) }, lp: 800, deck: [], discard: [], void: [] };
    const p1 = gameState.players[bottomPlayerIndex] || EMPTY_PLAYER;
    const p2 = gameState.players[topPlayerIndex] || EMPTY_PLAYER;

    // Resolve Selected Card for Sidebar
    let selectedCard: CardData | null = null;
    if (selectedHandIndex !== null) {
        selectedCard = p1.hand[selectedHandIndex];
    } else if (selectedFieldSlot) {
        const p = gameState.players[selectedFieldSlot.player];
        if (p) {
            if (selectedFieldSlot.type === 'pawn') selectedCard = p.field.pawns[selectedFieldSlot.slot];
            else selectedCard = p.field.utility[selectedFieldSlot.slot];
        }
    }

    // Should show tribute popup?
    const showTributePopup = selectedHandIndex !== null
        && selectedCard?.cardFamily === 'Pawn'
        && getTributesRequired(selectedCard.level ?? 1) > 0;

    // Handlers
    const handleHandCardClick = (index: number) => {
        if (interactionMode !== 'IDLE' && interactionMode !== 'SELECT_TRIBUTE') {
            setInteractionMode('IDLE');
            setTributeSelection([]);
        }
        setSelectedHandIndex(index);
        setSelectedFieldSlot(null);
    };

    const handleFieldSlotClick = (playerIndex: number, slotIndex: number, type: 'pawn' | 'utility') => {
        // Summon/Set zone selection
        if (interactionMode === 'SELECT_ZONE_SUMMON' || interactionMode === 'SELECT_ZONE_SET_PAWN') {
            if (playerIndex === bottomPlayerIndex && type === 'pawn' && selectedHandIndex !== null) {
                summonPawn(selectedHandIndex, slotIndex, interactionMode === 'SELECT_ZONE_SET_PAWN', tributeSelection);
                setInteractionMode('IDLE');
                setSelectedHandIndex(null);
                setTributeSelection([]);
                return;
            }
        }
        if (interactionMode === 'SELECT_ZONE_SET_UTILITY') {
            if (playerIndex === bottomPlayerIndex && type === 'utility' && selectedHandIndex !== null) {
                setCard(selectedHandIndex, slotIndex);
                setInteractionMode('IDLE');
                setSelectedHandIndex(null);
                return;
            }
        }
        if (interactionMode === 'SELECT_TARGET') {
            if (playerIndex !== bottomPlayerIndex && type === 'pawn' && selectedFieldSlot?.type === 'pawn') {
                declareAttack(selectedFieldSlot.slot, slotIndex, false);
                setInteractionMode('IDLE');
                return;
            }
        }

        // Tribute Selection
        if (interactionMode === 'SELECT_TRIBUTE') {
            if (playerIndex === bottomPlayerIndex && type === 'pawn') {
                if (tributeSelection.includes(slotIndex)) {
                    setTributeSelection(prev => prev.filter(i => i !== slotIndex));
                } else {
                    setTributeSelection(prev => [...prev, slotIndex]);
                }
                return;
            }
        }

        // Selection Logic
        setSelectedFieldSlot({ player: playerIndex, slot: slotIndex, type });
        setSelectedHandIndex(null);
        if (interactionMode !== 'SELECT_TRIBUTE') {
            setInteractionMode('IDLE');
            setTributeSelection([]);
        }
    };

    // Sidebar Actions
    const onSummonRequest = (isHidden: boolean) => {
        setInteractionMode(isHidden ? 'SELECT_ZONE_SET_PAWN' : 'SELECT_ZONE_SUMMON');
    };

    const onSetRequest = () => {
        setInteractionMode('SELECT_ZONE_SET_UTILITY');
    };

    const onActivateFromHand = () => {
        if (selectedHandIndex !== null) {
            activateCard('hand', selectedHandIndex);
            setSelectedHandIndex(null);
        }
    };

    const onActivateFromField = () => {
        if (selectedFieldSlot && selectedFieldSlot.type === 'utility') {
            activateCard('field', selectedFieldSlot.slot);
            setSelectedFieldSlot(null);
        }
    };

    // Tribute Flow
    const onStartTribute = () => {
        setTributeSelection([]);
        setInteractionMode('SELECT_TRIBUTE');
    };

    const onConfirmTributeSummon = () => {
        // Now enter zone selection — user picks where to put the summoned pawn
        setInteractionMode('SELECT_ZONE_SUMMON');
    };

    const onCancelTribute = () => {
        setInteractionMode('IDLE');
        setTributeSelection([]);
    };

    const handlePhaseBannerComplete = useCallback(() => {
        setPhaseBanner(null);

        // Auto-advance through non-interactive phases
        const autoPhases = ['Draw', 'Standby', 'End'];
        if (autoPhases.includes(gameState.currentPhase)) {
            // Brief delay before auto-advancing so the phase is visible
            setTimeout(() => {
                nextPhase();
            }, 300);
        }
    }, [gameState.currentPhase, nextPhase]);

    // Damage Popup State
    const [lpPopups, setLpPopups] = useState<{ id: number, amount: number, type: 'damage' | 'gain' }[]>([]);
    const prevP1LP = useRef(800);
    const prevP2LP = useRef(800);

    // Track LP changes for animations
    useEffect(() => {
        // Player 1 (Bottom) LP Changes
        if (p1.lp < prevP1LP.current) {
            const amount = prevP1LP.current - p1.lp;
            setLpPopups(prev => [...prev, { id: Date.now(), amount, type: 'damage' }]);
        } else if (p1.lp > prevP1LP.current) {
            const amount = p1.lp - prevP1LP.current;
            setLpPopups(prev => [...prev, { id: Date.now(), amount, type: 'gain' }]);
        }
        prevP1LP.current = p1.lp;

        // Player 2 (Top) LP Changes
        if (p2.lp < prevP2LP.current) {
            const amount = prevP2LP.current - p2.lp;
            setLpPopups(prev => [...prev, { id: Date.now() + 1, amount, type: 'damage' }]);
        } else if (p2.lp > prevP2LP.current) {
            const amount = p2.lp - prevP2LP.current;
            setLpPopups(prev => [...prev, { id: Date.now() + 1, amount, type: 'gain' }]);
        }
        prevP2LP.current = p2.lp;
    }, [p1.lp, p2.lp]);

    const removePopup = (id: number) => {
        setLpPopups(prev => prev.filter(p => p.id !== id));
    };

    // Attack Flow
    const onAttack = () => {
        // Check if opponent has pawns
        const opponentHasPawns = p2.field.pawns.some(p => p !== null);

        if (opponentHasPawns) {
            // Enter target selection mode
            setInteractionMode('SELECT_TARGET');
        } else {
            // Direct Attack
            if (activePlayerIndex === bottomPlayerIndex && selectedFieldSlot?.type === 'pawn') {
                declareAttack(selectedFieldSlot.slot, -1, true); // -1 for direct attack
                setSelectedFieldSlot(null);
            }
        }
    };

    return (
        <div className="retro-hash" style={{
            display: 'flex', height: '100vh', width: '100vw',
            backgroundColor: activePlayerIndex === 0 ? '#050505' : '#e2e8f0',
            color: activePlayerIndex === 0 ? 'white' : 'black',
            transition: 'background-color 0.5s ease, color 0.5s ease',
            position: 'relative', overflow: 'hidden', userSelect: 'none',
        }}>
            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

                {/* Exit Btn */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 40 }}>
                    <button onClick={onExit} style={{
                        padding: '8px 16px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8',
                        fontFamily: 'var(--font-header)', fontWeight: 'bold', fontSize: '11px', letterSpacing: '3px', backdropFilter: 'blur(12px)', cursor: 'pointer'
                    }}>EXIT GAME</button>
                </div>

                {error && (
                    <div style={{
                        position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(220, 38, 38, 0.9)', color: 'white', padding: '8px 16px', borderRadius: '4px',
                        zIndex: 100, border: '1px solid #ef4444'
                    }}>
                        Error: {error}
                    </div>
                )}

                <TurnControls
                    turn={gameState.turnCount}
                    activePlayer={gameState.activePlayerIndex}
                    currentPhase={gameState.currentPhase}
                    onNextPhase={nextPhase}
                    isMirrorMode={isMirrorMode}
                />

                {/* LifePoint Popups */}
                {lpPopups.map(popup => (
                    <LifePointPopup
                        key={popup.id}
                        amount={popup.amount}
                        type={popup.type}
                        onComplete={() => removePopup(popup.id)}
                    />
                ))}

                {/* Tribute Popup — below turn controls */}
                {showTributePopup && selectedCard && (
                    <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: 'calc(50% + 60px)',
                        zIndex: 35,
                        width: '220px',
                    }}>
                        <TributePopup
                            card={selectedCard}
                            player={p1}
                            tributeSelection={tributeSelection}
                            onStartTribute={onStartTribute}
                            onConfirmSummon={onConfirmTributeSummon}
                            onCancel={onCancelTribute}
                            isTributeMode={interactionMode === 'SELECT_TRIBUTE'}
                        />
                    </div>
                )}

                {/* Field Layout */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '60px', paddingBottom: '80px' }}>

                    <Hand isOpponent={true} cards={p2.hand} />

                    <div style={{ opacity: 0.9 }}>
                        <PlayerField
                            isOpponent={true}
                            entityZones={p2.field.pawns}
                            actionZones={p2.field.utility}
                            onDiscardClick={() => setViewingPile('discard')}
                            onVoidClick={() => setViewingPile('void')}
                            onEntityZoneClick={(i) => {
                                // If selecting target for attack
                                if (interactionMode === 'SELECT_TARGET') {
                                    handleFieldSlotClick(topPlayerIndex, i, 'pawn');
                                } else {
                                    handleFieldSlotClick(topPlayerIndex, i, 'pawn');
                                }
                            }}
                            onActionZoneClick={(i) => handleFieldSlotClick(topPlayerIndex, i, 'utility')}
                            selectableZones={
                                interactionMode === 'SELECT_TARGET'
                                    ? p2.field.pawns.map((p, i) => p ? { type: 'entity', index: i } : null).filter(Boolean) as any
                                    : []
                            }
                        />
                    </div>

                    <GameInfoBar
                        p1LP={p1.lp} p2LP={p2.lp}
                        topPlayerIndex={topPlayerIndex} bottomPlayerIndex={bottomPlayerIndex}
                        activePlayerIndex={activePlayerIndex}
                    />

                    <PlayerField
                        isOpponent={false}
                        entityZones={p1.field.pawns}
                        actionZones={p1.field.utility}
                        tributeSelection={tributeSelection}
                        onDiscardClick={() => setViewingPile('discard')}
                        onVoidClick={() => setViewingPile('void')}
                        onEntityZoneClick={(i) => handleFieldSlotClick(bottomPlayerIndex, i, 'pawn')}
                        onActionZoneClick={(i) => handleFieldSlotClick(bottomPlayerIndex, i, 'utility')}
                        selectableZones={
                            interactionMode === 'SELECT_ZONE_SUMMON' || interactionMode === 'SELECT_ZONE_SET_PAWN'
                                ? p1.field.pawns.map((p, i) => !p ? { type: 'entity', index: i } : null).filter(Boolean) as any
                                : interactionMode === 'SELECT_ZONE_SET_UTILITY'
                                    ? p1.field.utility.map((p, i) => !p ? { type: 'action', index: i } : null).filter(Boolean) as any
                                    : []
                        }
                    />
                </div>

                <Hand
                    isOpponent={false} cards={p1.hand}
                    selectedHandIndex={selectedHandIndex}
                    onCardClick={handleHandCardClick}
                />
            </div>

            <GameSidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                selectedCard={selectedCard}
                activePlayerIndex={activePlayerIndex}
                onSummon={onSummonRequest}
                onActivateFromHand={onActivateFromHand}
                onActivateFromField={onActivateFromField}
                onSet={onSetRequest}
                onAttack={onAttack}
                interactionContext={selectedHandIndex !== null ? 'hand' : selectedFieldSlot && selectedFieldSlot.player === bottomPlayerIndex ? 'field' : null}
                currentTurn={gameState.turnCount}
                currentPhase={gameState.currentPhase}
            />

            {viewingPile && (
                <PileViewerModal
                    title={viewingPile === 'discard' ? "Discard Pile" : "Void"}
                    cards={viewingPile === 'discard' ? p1.discard : p1.void}
                    type={viewingPile}
                    onClose={() => setViewingPile(null)}
                />
            )}

            {/* Phase Banner Overlay */}
            {phaseBanner && (
                <PhaseBanner
                    oldPhase={phaseBanner.oldPhase}
                    newPhase={phaseBanner.newPhase}
                    onComplete={handlePhaseBannerComplete}
                />
            )}
        </div>
    );
};

export default GameField;
