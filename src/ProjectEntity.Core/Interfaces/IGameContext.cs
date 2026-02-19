using ProjectEntity.Core.Models;

namespace ProjectEntity.Core.Interfaces;

public interface IGameContext
{
    void ModifyPlayerLifePoints(int playerIndex, int amount); // amount can be negative
    int GetPlayerLifePoints(int playerIndex);
    void DamagePlayer(int playerIndex, int amount);
    int GetOpponentIndex(int playerIndex);

    // For Force Fire Sparker
    int CountFieldCards(int playerIndex, Func<Card, bool> predicate);

    // For High King
    void ModifyPawnStat(int playerIndex, int slotIndex, int amount, string statName);

    // Access
    int ActivePlayerIndex { get; }
}
