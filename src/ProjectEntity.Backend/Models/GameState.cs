using ProjectEntity.Core.Models;
using ProjectEntity.Core.Interfaces;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ProjectEntity.Backend.Models;

public enum GamePhase
{
    Draw,
    Standby,
    Main1,
    Battle,
    Main2,
    End
}

public class ActivatingCard
{
    [JsonPropertyName("card")]
    public Card? Card { get; set; }

    [JsonPropertyName("playerIndex")]
    public int PlayerIndex { get; set; }

    [JsonPropertyName("slotIndex")]
    public int SlotIndex { get; set; } // -1 for hand
}

public class GameState : IGameContext
{
    [JsonPropertyName("gameId")]
    public Guid GameId { get; set; } = Guid.NewGuid();

    [JsonPropertyName("turnCount")]
    public int TurnCount { get; set; } = 1;

    [JsonPropertyName("currentPhase")]
    public GamePhase CurrentPhase { get; set; } = GamePhase.Draw;

    [JsonPropertyName("activePlayerIndex")]
    public int ActivePlayerIndex { get; set; } = 0;

    [JsonPropertyName("players")]
    public PlayerState[] Players { get; set; } = new PlayerState[2];

    // Turn Flags
    [JsonPropertyName("hasNormalSummoned")]
    public bool HasNormalSummoned { get; set; }

    [JsonPropertyName("hasPawnSet")]
    public bool HasPawnSet { get; set; }

    [JsonPropertyName("hasBattled")]
    public bool HasBattled { get; set; }

    [JsonPropertyName("activatingCard")]
    public ActivatingCard? ActivatingCard { get; set; }

    public GameState()
    {
        Players[0] = new PlayerState { Id = 0 };
        Players[1] = new PlayerState { Id = 1 };
    }

    // IGameContext Implementation
    [JsonIgnore]
    public int ActivePlayerId => ActivePlayerIndex;

    public void ModifyPlayerLifePoints(int playerIndex, int amount)
    {
        Players[playerIndex].LifePoints += amount;
    }

    public int GetPlayerLifePoints(int playerIndex)
    {
        return Players[playerIndex].LifePoints;
    }

    public void DamagePlayer(int playerIndex, int amount)
    {
        Players[playerIndex].LifePoints -= amount;
    }

    public int GetOpponentIndex(int playerIndex)
    {
        return playerIndex == 0 ? 1 : 0;
    }

    public int CountFieldCards(int playerIndex, Func<Card, bool> predicate)
    {
        int count = 0;
        var p = Players[playerIndex];
        foreach (var c in p.Field.ActionZones)
        {
            if (c != null && predicate(c)) count++;
        }
        return count;
    }

    public void ModifyPawnStat(int playerIndex, int slotIndex, int amount, string statName)
    {
        var pawn = Players[playerIndex].Field.PawnZones[slotIndex];
        if (pawn == null) return;
        if (statName == "ATK") pawn.Attack += amount;
        else if (statName == "DEF") pawn.Defense += amount;
    }
}

public class PlayerState
{
    [JsonIgnore]
    public int Id { get; set; }

    [JsonPropertyName("lp")]
    public int LifePoints { get; set; } = 800;

    [JsonPropertyName("hand")]
    public List<Card> Hand { get; set; } = new();

    [JsonPropertyName("deck")]
    public List<Card> Deck { get; set; } = new();

    [JsonPropertyName("discard")]
    public List<Card> DiscardPile { get; set; } = new();

    [JsonPropertyName("void")]
    public List<Card> VoidPile { get; set; } = new();

    [JsonPropertyName("field")]
    public FieldState Field { get; set; } = new();
}

public class FieldState
{
    [JsonPropertyName("pawns")]
    public Pawn?[] PawnZones { get; set; } = new Pawn?[5];

    [JsonPropertyName("utility")]
    public Card?[] ActionZones { get; set; } = new Card?[5];
}
