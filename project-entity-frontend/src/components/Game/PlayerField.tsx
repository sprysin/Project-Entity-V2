import React from 'react';
import Zone from './Zone';
import { Pile, DeckPile } from './Pile';
import type { CardData } from '../../types';

interface PlayerFieldProps {
    isOpponent?: boolean;
    // Pile counts
    discardCount?: number;
    voidCount?: number;
    deckCount?: number;
    discardFlash?: boolean;
    voidFlash?: boolean;
    // Zone data
    entityZones?: (CardData | null)[];
    actionZones?: (CardData | null)[];
    // Callbacks
    onDiscardClick?: () => void;
    onVoidClick?: () => void;
    onEntityZoneClick?: (index: number) => void;
    onActionZoneClick?: (index: number) => void;
    // Selection states
    selectedFieldSlot?: { type: 'entity' | 'action'; index: number } | null;
    selectableZones?: { type: 'entity' | 'action'; index: number }[];
    tributeSelection?: number[];
    dropTargetZones?: { type: 'entity' | 'action'; index: number }[];
    // Refs
    entityZoneRefs?: ((el: HTMLElement | null) => void)[];
    actionZoneRefs?: ((el: HTMLElement | null) => void)[];
    discardRef?: (el: HTMLElement | null) => void;
    voidRef?: (el: HTMLElement | null) => void;
    deckRef?: (el: HTMLElement | null) => void;
}

/**
 * PlayerField — renders one player's side of the field.
 */
const PlayerField: React.FC<PlayerFieldProps> = ({
    isOpponent = false,
    discardCount = 0,
    voidCount = 0,
    deckCount = 35,
    discardFlash = false,
    voidFlash = false,
    entityZones = Array(5).fill(null),
    actionZones = Array(5).fill(null),
    onDiscardClick,
    onVoidClick,
    onEntityZoneClick,
    onActionZoneClick,
    selectedFieldSlot,
    selectableZones = [],
    tributeSelection = [],
    dropTargetZones = [],
    entityZoneRefs,
    actionZoneRefs,
    discardRef,
    voidRef,
    deckRef,
}) => {
    const ROW_GAP = '16px';
    const ZONE_GAP = '12px';

    const isZoneSelectable = (type: 'entity' | 'action', index: number) =>
        selectableZones.some(z => z.type === type && z.index === index);
    const isDropTarget = (type: 'entity' | 'action', index: number) =>
        dropTargetZones.some(z => z.type === type && z.index === index);

    // Entity row
    const EntityRow = () => (
        <div style={{ display: 'flex', gap: ZONE_GAP, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: ZONE_GAP }}>
                {entityZones.map((z, i) => (
                    <Zone
                        key={`entity-${i}`}
                        type="entity"
                        owner={isOpponent ? 'opponent' : 'active'}
                        card={z ? {
                            name: z.name,
                            effectText: z.effectText,
                            atk: z.attack ?? 0,
                            def: z.defense ?? 0,
                            cardType: 'entity',
                            isHidden: z.isFaceDown,
                            isDefense: z.currentPosition === 'Defense' || z.isFaceDown,
                        } : null}
                        isSelected={selectedFieldSlot?.type === 'entity' && selectedFieldSlot?.index === i}
                        isSelectable={isZoneSelectable('entity', i)}
                        isTributeSelected={tributeSelection.includes(i)}
                        isDropTarget={isDropTarget('entity', i)}
                        onClick={() => onEntityZoneClick?.(i)}
                        domRef={entityZoneRefs?.[i]}
                    />
                ))}
            </div>
            {/* Piles next to entity row */}
            <div style={{ display: 'flex', gap: ZONE_GAP, marginLeft: '8px' }}>
                <Pile count={discardCount} label="Discard" color="slate" isFlashing={discardFlash} onClick={onDiscardClick} domRef={discardRef} />
                <Pile count={voidCount} label="Void" color="purple" isFlashing={voidFlash} onClick={onVoidClick} domRef={voidRef} />
            </div>
        </div>
    );

    // Action row
    const ActionRow = () => (
        <div style={{ display: 'flex', gap: ZONE_GAP, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: ZONE_GAP }}>
                {actionZones.map((z, i) => (
                    <Zone
                        key={`action-${i}`}
                        type="action"
                        owner={isOpponent ? 'opponent' : 'active'}
                        card={z ? {
                            name: z.name,
                            effectText: z.effectText,
                            cardType: z.type === 'Condition' ? 'condition' : 'action',
                            isHidden: z.isFaceDown,
                        } : null}
                        isSelected={selectedFieldSlot?.type === 'action' && selectedFieldSlot?.index === i}
                        isSelectable={isZoneSelectable('action', i)}
                        isDropTarget={isDropTarget('action', i)}
                        onClick={() => onActionZoneClick?.(i)}
                        domRef={actionZoneRefs?.[i]}
                    />
                ))}
            </div>
            {/* Deck next to action row */}
            <div style={{ marginLeft: '8px' }}>
                <DeckPile count={deckCount} domRef={deckRef} />
            </div>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: ROW_GAP,
            padding: '8px 0',
        }}>
            {isOpponent ? (
                // Opponent: Action row closer to top, Entity row closer to center
                <>
                    <ActionRow />
                    <EntityRow />
                </>
            ) : (
                // Active player: Entity row closer to center, Action row below
                <>
                    <EntityRow />
                    <ActionRow />
                </>
            )}
        </div>
    );
};

export default PlayerField;
