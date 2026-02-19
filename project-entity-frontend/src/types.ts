
export interface CardData {
    id: string;
    name: string;
    cardFamily: 'Pawn' | 'Utility';

    // Pawn specifics
    level?: number;
    attribute?: string; // Fire, Water, etc.
    pawnType?: string; // Warrior, Dragon, etc.
    attack?: number;
    defense?: number;

    // Utility specifics
    type?: 'Action' | 'Condition';
    subType?: 'Normal' | 'Fast' | 'Lingering';

    effectText: string;

    // Instance specific (for tracking individual cards in game)
    instanceId?: string;
    owner?: number; // 0 or 1

    // Runtime state (optional)
    currentPosition?: 'Attack' | 'Defense';
    isFaceDown?: boolean;
    hasAttacked?: boolean;
    turnSetOn?: number; // Turn number when this card was set (for Condition activation timing)
    originalOwnerIndex?: number;
}

export interface PlayerState {
    lp: number;
    hand: CardData[];
    deck: CardData[];
    discard: CardData[];
    void: CardData[];
    field: {
        pawns: (CardData | null)[]; // 5 slots
        utility: (CardData | null)[]; // 5 slots
    };
}


// Removed old Phase const/type in favor of Enum matching backend

export interface ActivatingCard {
    card: CardData;
    playerIndex: number;
    slotIndex: number; // utility slot it's shown in (-1 if from hand)
}

export interface GameState {
    gameId?: string;
    players: PlayerState[]; // Backend returns array
    turnCount: number;
    currentPhase: GamePhase;
    activePlayerIndex: number; // 0 or 1

    // Turn Flags (Lv1-4 only — tribute summons are unlimited)
    hasNormalSummoned: boolean; // Lv1-4 normal summon used
    hasPawnSet: boolean;        // Lv1-4 set used
    hasBattled: boolean;

    // Activation animation
    activatingCard: ActivatingCard | null;
}

export interface GameActionRequest {
    actionType: string;
    playerIndex: number;
    handIndex: number;
    slotIndex: number;
    targetSlotIndex: number;
    isHidden: boolean;
    tributeIndices?: number[];
}

export const GamePhase = {
    Draw: "Draw",
    Standby: "Standby",
    Main1: "Main1",
    Battle: "Battle",
    Main2: "Main2",
    End: "End"
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];
