import { useState, useCallback } from 'react';
import type { GameState, GameActionRequest, PlayerState } from '../types';
import { GamePhase } from '../types';

const API_URL = 'http://localhost:5207/api/game';

/** How many tributes are required to summon a pawn of the given level. */
export function getTributesRequired(level: number): number {
    if (level >= 8) return 2;
    if (level >= 5) return 1;
    return 0;
}

/** Count non-null pawns on the player's field. */
export function countFieldPawns(player: PlayerState): number {
    return player.field.pawns.filter(p => p !== null).length;
}

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>({
        players: [],
        turnCount: 0,
        currentPhase: GamePhase.Draw,
        activePlayerIndex: 0,
        hasNormalSummoned: false,
        hasPawnSet: false,
        hasBattled: false, // Lv1-4 only
        activatingCard: null,
    });
    const [gameLog, setGameLog] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const addLog = useCallback((msg: string) => {
        setGameLog(prev => [msg, ...prev]);
    }, []);

    // Removed fetchState as it was unused and caused lint error

    // ... rest of hook

    const initializeGame = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/start`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to start game');
            const data = await res.json();
            setGameState(data);
            setGameLog(['Game started — Player 1 goes first.']);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    }, []);

    const sendAction = useCallback(async (req: GameActionRequest, logMessage?: string) => {
        try {
            const res = await fetch(`${API_URL}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ message: res.statusText }));
                throw new Error(errData.message || 'Action failed');
            }

            const newState = await res.json();
            setGameState(newState);
            if (logMessage) addLog(logMessage);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            addLog(`Error: ${err.message}`);
        }
    }, [addLog]);

    const nextPhase = useCallback(() => {
        sendAction({
            actionType: 'EndPhase',
            playerIndex: gameState.activePlayerIndex,
            handIndex: -1,
            slotIndex: -1,
            targetSlotIndex: -1,
            isHidden: false,
        }, `Phase changed`);
    }, [gameState.activePlayerIndex, sendAction]);

    const summonPawn = useCallback((handIndex: number, slotIndex: number, isHidden: boolean, tributeIndices: number[] = []) => {
        sendAction({
            actionType: 'Summon',
            playerIndex: gameState.activePlayerIndex,
            handIndex,
            slotIndex,
            targetSlotIndex: -1,
            isHidden,
            tributeIndices,
        }, isHidden ? 'Set Pawn (Hidden)' : 'Summoned Pawn');
    }, [gameState.activePlayerIndex, sendAction]);

    const setCard = useCallback((handIndex: number, slotIndex: number) => {
        sendAction({
            actionType: 'Set',
            playerIndex: gameState.activePlayerIndex,
            handIndex,
            slotIndex,
            targetSlotIndex: -1,
            isHidden: true,
        }, 'Set Utility Card');
    }, [gameState.activePlayerIndex, sendAction]);

    const activateCard = useCallback((source: 'hand' | 'field', index: number) => {
        sendAction({
            actionType: 'Activate',
            playerIndex: gameState.activePlayerIndex,
            handIndex: source === 'hand' ? index : -1,
            slotIndex: source === 'field' ? index : -1,
            targetSlotIndex: -1,
            isHidden: false,
        }, 'Activated Card');
    }, [gameState.activePlayerIndex, sendAction]);

    const resolveActivation = useCallback(() => {
        // Resolve logic in backend clears the activatingCard state
        // We just need to trigger it.
        // But need to know WHO is resolving? Usually active player or the owner of activating card?
        // GameState has `activatingCard`. Backend `HandleResolve` uses `CurrentGame.ActivatingCard`.
        // So request parameters don't strictly matter if backend uses state, but good to send active valid request.
        if (!gameState.activatingCard) return;

        sendAction({
            actionType: 'Resolve',
            playerIndex: gameState.activatingCard.playerIndex, // Or active player? Logic should use stored state
            handIndex: -1,
            slotIndex: -1,
            targetSlotIndex: -1,
            isHidden: false,
        });
    }, [gameState.activatingCard, sendAction]);

    const declareAttack = useCallback((attackerSlot: number, targetSlot: number, isDirect: boolean) => {
        sendAction({
            actionType: 'Attack',
            playerIndex: gameState.activePlayerIndex,
            handIndex: -1,
            slotIndex: attackerSlot,
            targetSlotIndex: isDirect ? -1 : targetSlot,
            isHidden: false,
        }, 'declared Attack');
    }, [gameState.activePlayerIndex, sendAction]);

    return {
        gameState,
        gameLog,
        error,
        initializeGame,
        nextPhase,
        summonPawn,
        setCard,
        activateCard,
        declareAttack,
        resolveActivation,
    };
};
