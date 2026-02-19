using ProjectEntity.Backend.Models;
using ProjectEntity.Core.Models;
using ProjectEntity.Core.Systems;
using System.Collections.Generic;
using System;
using System.Linq;

namespace ProjectEntity.Backend.Services;

public class GameService
{
    // Single game instance for now
    public GameState CurrentGame { get; private set; } = new GameState();
    private readonly CardDatabase _cardDatabase;

    public GameService()
    {
        _cardDatabase = new CardDatabase();
        _cardDatabase.LoadCards();
    }

    public GameState StartGame()
    {
        CurrentGame = new GameState();
        InitializePlayer(0);
        InitializePlayer(1);
        CurrentGame.CurrentPhase = GamePhase.Main1;
        CurrentGame.TurnCount = 1;
        return CurrentGame;
    }

    private void InitializePlayer(int playerIndex)
    {
        var player = CurrentGame.Players[playerIndex];
        player.Deck = CreateRandomDeck(playerIndex);
        player.Hand = DrawCards(player.Deck, 5);
        player.LifePoints = 800;
        player.Field = new FieldState();
    }

    private List<Card> CreateRandomDeck(int ownerIndex)
    {
        var allCards = _cardDatabase.GetAllCards().ToList();
        var deck = new List<Card>();
        var random = new Random();
        for (int i = 0; i < 40; i++)
        {
            var cardTemplate = allCards[random.Next(allCards.Count)];
            var instance = cardTemplate.CreateInstance();
            instance.OriginalOwnerIndex = ownerIndex;
            deck.Add(instance);
        }
        return deck;
    }

    private List<Card> DrawCards(List<Card> deck, int count)
    {
        var drawn = deck.Take(count).ToList();
        deck.RemoveRange(0, Math.Min(count, deck.Count));
        return drawn;
    }

    public GameState ExecuteAction(GameActionRequest request)
    {
        if (request.PlayerIndex != CurrentGame.ActivePlayerIndex)
            throw new Exception("Not your turn!");

        switch (request.ActionType)
        {
            case "Summon":
                HandleSummon(request);
                break;
            case "Set":
                HandleSet(request);
                break;
            case "Activate":
                HandleActivate(request);
                break;
            case "Resolve":
                HandleResolve(request);
                break;
            case "Attack":
                HandleAttack(request);
                break;
            case "EndPhase":
                HandlePhaseChange();
                break;
            default:
                throw new Exception($"Unknown action type: {request.ActionType}");
        }

        return CurrentGame;
    }

    private void HandleSummon(GameActionRequest req)
    {
        var player = CurrentGame.Players[req.PlayerIndex];
        if (req.HandIndex < 0 || req.HandIndex >= player.Hand.Count) return;

        var card = player.Hand[req.HandIndex] as Pawn;
        if (card == null) throw new Exception("Not a pawn.");

        int level = card.Level;
        int tributesNeeded = level >= 8 ? 2 : level >= 5 ? 1 : 0;

        // Validation
        if (tributesNeeded == 0)
        {
            // Lv1-4 Limits
            if (req.IsHidden)
            {
                if (CurrentGame.HasPawnSet) throw new Exception("Already set a pawn this turn.");
            }
            else
            {
                if (CurrentGame.HasNormalSummoned) throw new Exception("Already normal summoned this turn.");
            }
        }
        else
        {
            // Lv5+ Unlimited, but requires tributes
            if (req.TributeIndices.Count != tributesNeeded)
                throw new Exception($"Requires {tributesNeeded} tributes.");

            foreach (var idx in req.TributeIndices)
            {
                if (player.Field.PawnZones[idx] == null)
                    throw new Exception("Invalid tribute target.");
            }
        }

        // Process Tributes
        foreach (var idx in req.TributeIndices)
        {
            var tribute = player.Field.PawnZones[idx];
            if (tribute != null)
            {
                player.DiscardPile.Add(tribute);
                player.Field.PawnZones[idx] = null;
            }
        }

        // Move Card
        player.Hand.RemoveAt(req.HandIndex);
        card.IsFaceDown = req.IsHidden;
        card.CurrentPosition = req.IsHidden ? "Defense" : "Attack";

        player.Field.PawnZones[req.SlotIndex] = card;

        // Set Flags (only for Lv1-4)
        if (tributesNeeded == 0)
        {
            if (req.IsHidden) CurrentGame.HasPawnSet = true;
            else CurrentGame.HasNormalSummoned = true;
        }

        // Execute "On Summon" effects
        if (!req.IsHidden && card.Effects.Any())
        {
            card.Play(CurrentGame, card);
        }
    }

    private void HandleSet(GameActionRequest req)
    {
        var player = CurrentGame.Players[req.PlayerIndex];
        if (req.HandIndex < 0 || req.HandIndex >= player.Hand.Count) return;

        var card = player.Hand[req.HandIndex];

        // Card Type Logic
        if (card is Pawn pawn)
        {
            // Set Pawn - redirect to Summon with isHidden=true
            HandleSummon(new GameActionRequest
            {
                PlayerIndex = req.PlayerIndex,
                HandIndex = req.HandIndex,
                SlotIndex = req.SlotIndex,
                IsHidden = true,
                ActionType = "Summon"
            });
            return;
        }

        // Utility Set
        player.Hand.RemoveAt(req.HandIndex);
        card.IsFaceDown = true;
        card.TurnSetOn = CurrentGame.TurnCount;
        player.Field.ActionZones[req.SlotIndex] = card;
    }

    private void HandleActivate(GameActionRequest req)
    {
        // Check if there is already an activation in progress
        if (CurrentGame.ActivatingCard != null) throw new Exception("Animation in progress.");

        var player = CurrentGame.Players[req.PlayerIndex];
        Card? card = null;
        int slotIndex = -1;

        // Determine Source
        if (req.SlotIndex == -1) // From Hand
        {
            // Activate from Hand
            if (req.HandIndex < 0 || req.HandIndex >= player.Hand.Count) throw new Exception("Invalid hand index.");
            card = player.Hand[req.HandIndex];

            if (card.Type == CardType.Condition) throw new Exception("Conditions cannot activate from hand.");

            player.Hand.RemoveAt(req.HandIndex);

            // Find empty slot for animation
            for (int i = 0; i < 5; i++)
            {
                if (player.Field.ActionZones[i] == null)
                {
                    slotIndex = i;
                    break;
                }
            }
            if (slotIndex == -1) throw new Exception("No space to activate card.");
        }
        else // From Field
        {
            slotIndex = req.SlotIndex;
            card = player.Field.ActionZones[slotIndex];
            if (card == null) throw new Exception("No card at slot.");

            if (card.Type == CardType.Condition)
            {
                // Check turn count
                int setTurn = card.TurnSetOn ?? CurrentGame.TurnCount;
                if (CurrentGame.TurnCount - setTurn < 2) throw new Exception("Must wait 1 full turn.");
            }
        }

        // Set Activation State
        CurrentGame.ActivatingCard = new ActivatingCard
        {
            Card = card,
            PlayerIndex = req.PlayerIndex,
            SlotIndex = slotIndex
        };

        // Place card on field for visual (if not already there or if came from hand)
        player.Field.ActionZones[slotIndex] = card;
        card.IsFaceDown = false; // Reveal

        // EXECUTE EFFECTS
        card.Play(CurrentGame, card);
    }

    private void HandleResolve(GameActionRequest req)
    {
        if (CurrentGame.ActivatingCard == null) return;

        var act = CurrentGame.ActivatingCard;
        var player = CurrentGame.Players[act.PlayerIndex];

        // Remove from field
        if (act.SlotIndex >= 0 && act.SlotIndex < 5)
        {
            player.Field.ActionZones[act.SlotIndex] = null;
        }

        // Add to discard
        if (act.Card != null)
        {
            player.DiscardPile.Insert(0, act.Card);
        }

        CurrentGame.ActivatingCard = null;
    }

    private void HandleAttack(GameActionRequest req)
    {
        if (CurrentGame.CurrentPhase != GamePhase.Battle) throw new Exception("Not Battle Phase.");

        var attackerPlayer = CurrentGame.Players[req.PlayerIndex];
        var opponentIndex = CurrentGame.GetOpponentIndex(req.PlayerIndex);
        var opponentPlayer = CurrentGame.Players[opponentIndex];

        var attacker = attackerPlayer.Field.PawnZones[req.SlotIndex];
        if (attacker == null) throw new Exception("No attacker.");
        if (attacker.HasAttacked) throw new Exception("Already attacked.");

        bool isDirect = true;
        foreach (var p in opponentPlayer.Field.PawnZones) { if (p != null) isDirect = false; }

        if (isDirect)
        {
            CurrentGame.DamagePlayer(opponentIndex, attacker.Attack);
        }
        else
        {
            var target = opponentPlayer.Field.PawnZones[req.TargetSlotIndex];
            if (target == null) throw new Exception("Invalid target.");

            int attackStat = attacker.Attack;
            int defenseStat = target.CurrentPosition == "Attack" ? target.Attack : target.Defense;

            if (target.CurrentPosition == "Attack")
            {
                if (attackStat > defenseStat)
                {
                    opponentPlayer.Field.PawnZones[req.TargetSlotIndex] = null;
                    opponentPlayer.DiscardPile.Insert(0, target);
                    CurrentGame.DamagePlayer(opponentIndex, attackStat - defenseStat);
                }
                else if (attackStat < defenseStat)
                {
                    attackerPlayer.Field.PawnZones[req.SlotIndex] = null;
                    attackerPlayer.DiscardPile.Insert(0, attacker);
                    CurrentGame.DamagePlayer(req.PlayerIndex, defenseStat - attackStat);
                }
                else
                {
                    // Crash
                    opponentPlayer.Field.PawnZones[req.TargetSlotIndex] = null;
                    opponentPlayer.DiscardPile.Insert(0, target);
                    attackerPlayer.Field.PawnZones[req.SlotIndex] = null;
                    attackerPlayer.DiscardPile.Insert(0, attacker);
                }
            }
            else // Defense
            {
                if (attackStat > defenseStat)
                {
                    opponentPlayer.Field.PawnZones[req.TargetSlotIndex] = null;
                    opponentPlayer.DiscardPile.Insert(0, target);
                }
                else if (attackStat < defenseStat)
                {
                    CurrentGame.DamagePlayer(req.PlayerIndex, defenseStat - attackStat);
                }
            }
        }

        if (attackerPlayer.Field.PawnZones[req.SlotIndex] != null)
        {
            attacker.HasAttacked = true;
        }

        CurrentGame.HasBattled = true;
    }

    private void HandlePhaseChange()
    {
        switch (CurrentGame.CurrentPhase)
        {
            case GamePhase.Draw:
                CurrentGame.CurrentPhase = GamePhase.Standby;
                break;

            case GamePhase.Standby:
                CurrentGame.CurrentPhase = GamePhase.Main1;
                break;

            case GamePhase.Main1:
                // Skip Battle Phase on Turn 1
                if (CurrentGame.TurnCount == 1)
                {
                    CurrentGame.CurrentPhase = GamePhase.End;
                }
                else
                {
                    CurrentGame.CurrentPhase = GamePhase.Battle;
                }
                break;

            case GamePhase.Battle:
                CurrentGame.CurrentPhase = GamePhase.Main2;
                break;

            case GamePhase.Main2:
                CurrentGame.CurrentPhase = GamePhase.End;
                break;

            case GamePhase.End:
                // Swap active player, reset flags, draw card, go to Draw phase
                CurrentGame.ActivePlayerIndex = CurrentGame.GetOpponentIndex(CurrentGame.ActivePlayerIndex);
                CurrentGame.TurnCount++;
                CurrentGame.HasNormalSummoned = false;
                CurrentGame.HasPawnSet = false;
                CurrentGame.HasBattled = false;
                CurrentGame.ActivatingCard = null;

                // Reset all pawns' HasAttacked flag for new turn
                foreach (var p in CurrentGame.Players)
                    foreach (var pawn in p.Field.PawnZones)
                        if (pawn != null) pawn.HasAttacked = false;

                // Draw Logic: Draw until 5 cards in hand, OR draw 1 if already at 5+
                var player = CurrentGame.Players[CurrentGame.ActivePlayerIndex];
                if (player.Deck.Count > 0)
                {
                    int cardsToDraw = 1;
                    if (player.Hand.Count < 5)
                    {
                        cardsToDraw = 5 - player.Hand.Count;
                    }

                    // Don't draw more than deck size
                    cardsToDraw = Math.Min(cardsToDraw, player.Deck.Count);

                    player.Hand.AddRange(DrawCards(player.Deck, cardsToDraw));
                }

                CurrentGame.CurrentPhase = GamePhase.Draw;
                break;
        }
    }
}
