using ProjectEntity.Core.Interfaces;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ProjectEntity.Core.Models;

public enum CardType
{
    Pawn,
    Action,
    Condition
}

public abstract class Card
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("effectText")]
    public string EffectText { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string TypeName
    {
        get => Type switch
        {
            CardType.Action => "Action",
            CardType.Condition => "Condition",
            _ => "Pawn"
        };
    }

    [JsonIgnore]
    public CardType Type { get; set; }

    [JsonPropertyName("cardFamily")]
    public string CardFamily => Type == CardType.Pawn ? "Pawn" : "Utility";

    // Runtime state
    [JsonPropertyName("isFaceDown")]
    public bool IsFaceDown { get; set; } = false;

    [JsonPropertyName("turnSetOn")]
    public int? TurnSetOn { get; set; }

    [JsonPropertyName("originalOwnerIndex")]
    public int OriginalOwnerIndex { get; set; }

    [JsonIgnore]
    public List<IEffect> Effects { get; set; } = new();

    public Card CreateInstance()
    {
        return (Card)Activator.CreateInstance(GetType())!;
    }

    public Card(string id, string name, CardType type)
    {
        Id = id;
        Name = name;
        Type = type;
    }

    protected Card() { }

    public virtual void Play(IGameContext context, object source)
    {
        foreach (var effect in Effects)
        {
            effect.Execute(context, this);
        }
    }
}
