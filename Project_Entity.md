# Project Entity: Official Game Engine Specification

## Overview

Project Entity is a tactical card game where you summon Pawns with unique effects while also manipulating the field through Actions and Condition cards. With the goal of making your opponents life points reach 0.

Inspired by classic "no-mana" systems, the game mainly gets card advantage through a "Draw to 5" mechanic and other searching card effects. Players must balance the raw power of high-level Pawns, which require Tributes to summon, with the reactive utility of fast-paced Actions and hidden Conditions cards. With a stat system based on hundreds. There is a discard pile and a "Void" mechanic for permanent removal.

## 1. Game State & Hand Management

**Starting Life Points (LP):** 800 for both players.

**Starting Hand:** 5 cards for both players.

**Draw Mechanic:** During the Draw Phase, the active player draws cards until their hand size equals 5. If they already have 5 or more, the active player draws 1 card.

### Zones & Piles

- **Deck:** Standard draw pile.
- **Discard Pile (Graveyard):** For destroyed Pawns and used Actions.
- **The Void:** A stand-in for the "banish" pile. Rule: Any card sent to the Void is inaccessible for the remainder of the game.

## 2. Card Types & Anatomy

### Pawn Cards (the creatures of this game)

**Attributes:** Fire, Water, Earth, Air, Electric, Normal, Dark, Light.

**Types:** Warrior, Magician, Dragon, Mechanical, Demon, Angel, Plant, Fish, Beast, Elemental, Primal, Avion, Undead, Bug.

**Stats:** Name, Level (1-10), ATK, DEF, Effect Text.

**Stat Scaling:** Uses the 100th system (e.g., Level 4 Pawn ~120 ATK).

### Summoning Rules

- **Normal Summon (Level 1-4):** Limited to once per turn. No tribute.
- **Hidden Summon (Set):** Limited to once per turn. Face-down Defense.
- **Tribute Summon (Level 5-7):** Requires 1 Tribute. Unlimited per turn.
- **Tribute Summon (Level 8-10):** Requires 2 Tributes. Unlimited per turn.

**Positions:** Attack Position (Uses ATK) or Defense Position (Uses DEF).

**Position Change:** Change manually once per turn, but not on the same turn it was summoned.

### Action Cards

Actions are proactive cards used to influence the game state. They have three distinct speeds/behaviors:

**Normal Action:**
- **Timing:** Activated only during the owner's Main Phase 1 or 2.
- **Persistence:** Moved to the Discard Pile immediately after resolution.

**Fast Action:**
- **Timing:** Activated during any phase of either player's turn.
- **Reactive Use:** Can be played from the hand during the owner's turn.
- **Set Requirement:** To use during the opponent's turn, it must have been Set face-down during the owner's previous turn.
- **Persistence:** Moved to the Discard Pile after resolution.

**Lingering Action:**
- **Timing:** Activated during the owner's Main Phase 1 or 2.
- **Persistence:** Remains face-up on the field; effect persists as long as the card is present.

### Condition Cards

Conditions are reactive cards that must be waited before use. They have two distinct behaviors:

**Placement Rule:** All Condition cards must be Set face-down for at least one full turn (specifically, until the start of the next turn) before they can be activated.

**Normal Condition:**
- **Timing:** Can be triggered during either player's turn as soon as its specific activation requirement is met.
- **Persistence:** Moved to the Discard Pile immediately after its effect resolves.

**Lingering Condition:**
- **Timing:** Can be triggered during either player's turn as soon as its specific activation requirement is met.
- **Persistence:** Remains face-up in the Action/Condition Zone after activation. Its effect continues to apply to the field as long as it remains on the field.

## 3. Field Layout

- **Pawn Zones:** 5 slots for Pawn cards.
- **Condition/Action Zones:** 5 slots for Actions and Conditions.

## 4. The Turn Cycle (Phases)

1. **Draw Phase:** Draw to 5 cards. Resolve "Start of Turn" effects AFTER draw.
2. **Main Phase 1:** 
   - 1 Normal/Hidden Summon.
   - Unlimited Tribute/Special Summons.
   - Change Position: If Pawn was on field at start of turn.
   - Activate/Set Actions and Conditions.
3. **Battle Phase (Optional):** Skipped on Turn 1. Direct attacks allowed only if opponent's Pawn Zones are empty.
4. **Main Phase 2:** Accessible only if Battle Phase occurred.
5. **End Phase:** Pass turn; resolve "End of Turn" effects.

## 5. Combat Logic & Destruction

**Destruction Rule:** Destroyed Pawns move to the Discard Pile.

**Attack vs. Attack:** Higher ATK destroys lower. Difference is dealt as damage to opponent's LP.

**Attack vs. Defense:**
- If ATK > DEF: Defense card destroyed; 0 damage to owner.
- If DEF > ATK: Attacker takes difference as damage; no destruction.

**Direct Attack:** Full ATK as damage to LP.

## 6. Coding Assistance

- **State Machine:** Track "turn set". Conditions cannot be toggled to 'Active' on the turn they are placed.
- **Visuals:** Pawns (Gold), Actions (Green), Conditions (Pink/Purple).
- **Metadata Display:** Show ATTRIBUTE, TYPE, LEVEL and EFFECT on Pawn cards.
