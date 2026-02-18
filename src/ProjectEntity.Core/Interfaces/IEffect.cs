namespace ProjectEntity.Core.Interfaces;

public interface IEffect
{
    string Name { get; }
    // Description removed as Card.Description is the source of truth


    // Using object for now, but will replace with strongly typed GameState and Card/Player
    void Execute(object gameState, object source);
}
