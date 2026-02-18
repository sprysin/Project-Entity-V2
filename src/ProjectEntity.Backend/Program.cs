using System;
using ProjectEntity.Core.Systems;

namespace ProjectEntity.Backend;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("=== Project Entity Backend Service v1.0.0 ===");
        
        // Load Cards to ensure integrity
        var database = new CardDatabase();
        database.LoadCards();
        
        Console.WriteLine($"[System] Loaded {database.GetAllCards().Count()} cards into memory.");
        Console.WriteLine("[System] Listening for client connections on Port 5000 (Simulated)...");
        
        // Prevent console from closing immediately
        while (true)
        {
            var command = Console.ReadLine();
            if (command == "exit") break;
            if (command == "status") Console.WriteLine("[Status] Service Operational.");
        }
    }
}
