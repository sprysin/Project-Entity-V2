using ProjectEntity.Core.Models;
using System.Reflection;

namespace ProjectEntity.Core.Systems;

public class CardDatabase
{
    private Dictionary<string, Card> _cards = new();

    public void LoadCards()
    {
        // Find all types inheriting from Card in the current assembly
        var cardTypes = Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => t.IsSubclassOf(typeof(Card)) && !t.IsAbstract);

        foreach (var type in cardTypes)
        {
            try
            {
                if (Activator.CreateInstance(type) is Card cardInstance)
                {
                    // Register by ID or Name
                    if (!string.IsNullOrEmpty(cardInstance.Id))
                    {
                        _cards[cardInstance.Id] = cardInstance;
                        Console.WriteLine($"[Database] Loaded card: {cardInstance.Name} ({cardInstance.Id})");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Database] Failed to load card {type.Name}: {ex.Message}");
            }
        }
    }

    public Card? GetCard(string id)
    {
        return _cards.TryGetValue(id, out var card) ? card : null;
    }

    public IEnumerable<Card> GetAllCards()
    {
        return _cards.Values;
    }
}
