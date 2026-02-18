export type PawnAttribute = 'Fire' | 'Water' | 'Earth' | 'Air' | 'Electric' | 'Normal' | 'Dark' | 'Light';

export type UtilityCardType = 'Action' | 'Condition';
export type UtilitySubType = 'Normal' | 'Lingering';

export type PawnData = {
    cardFamily: 'Pawn';
    id: string;
    name: string;
    level: number;
    attribute: PawnAttribute;
    pawnType: string;
    effectText: string;
    attack: number;
    defense: number;
};

export type UtilityData = {
    cardFamily: 'Utility';
    id: string;
    name: string;
    type: UtilityCardType;
    subType: UtilitySubType;
    effectText: string;
};

export type CardData = PawnData | UtilityData;
