using ProjectEntity.Core.Interfaces;

namespace ProjectEntity.Core.Models;

public enum CardType
{
    Pawn,
    Action,
    Condition
}

public abstract class Card
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string EffectText { get; set; } = string.Empty;
    public CardType Type { get; set; }

    public List<IEffect> Effects { get; set; } = new();

    public Card(string id, string name, CardType type)
    {
        Id = id;
        Name = name;
        Type = type;
    }

    public virtual void Play(object gameState)
    {
        // Default play behavior
        foreach (var effect in Effects)
        {
            effect.Execute(gameState, this);
        }
    }
}
