using ProjectEntity.Core.Systems;
using ProjectEntity.Core.Models;

namespace ProjectEntity.Core;

public class GameDemo
{
    public static void Start()
    {
        Console.WriteLine("=== Project Entity Demo Start ===");

        // 1. Initialize Database
        var database = new CardDatabase();
        database.LoadCards(); // Should load Solstice Sentinel

        // 2. Retrieve the specific card
        var cardId = "solstice_sentinel";
        var card = database.GetCard(cardId);

        if (card != null)
        {
            Console.WriteLine($"\nFetched Card: {card.Name}");
            if (card is Pawn pawn)
            {
                Console.WriteLine($"Type: {pawn.PawnType} | Level: {pawn.Level}");
                Console.WriteLine($"Stats: {pawn.Attack}/{pawn.Defense}");
                Console.WriteLine($"Attribute: {pawn.Attribute}");
            }
            Console.WriteLine($"Effect Text: {card.EffectText}");

            // 3. Construct a fake Play scenario
            card.Play(gameState: null); // Pass null for now
        }
        else
        {
            Console.WriteLine($"\n[Error] Card '{cardId}' not found!");
        }

        // Test Void Blast
        var voidBlast = database.GetCard("void_blast");
        if (voidBlast != null)
        {
            Console.WriteLine($"\nFetched Card: {voidBlast.Name}");
            Console.WriteLine($"Type: {voidBlast.Type}");
            Console.WriteLine($"Effect Text: {voidBlast.EffectText}");
            voidBlast.Play(null);
        }

        // Test Reinforcement
        var reinforcement = database.GetCard("reinforcement");
        if (reinforcement != null)
        {
            Console.WriteLine($"\nFetched Card: {reinforcement.Name}");
            Console.WriteLine($"Type: {reinforcement.Type}");
            Console.WriteLine($"Effect Text: {reinforcement.EffectText}");
            reinforcement.Play(null);
        }

        Console.WriteLine("\n=== Demo End ===");
    }
}
