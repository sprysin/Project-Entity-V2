using System.Text.Json.Serialization;

namespace ProjectEntity.Core.Models;

public enum PawnAttribute
{
    Fire, Water, Earth, Air, Electric, Normal, Dark, Light
}

public enum PawnType
{
    Warrior, Magician, Dragon, Mechanical, Demon, Angel, Plant, Fish, Beast, Elemental, Primal, Avion, Undead, Bug
}

public abstract class Pawn : Card
{
    [JsonPropertyName("level")]
    public int Level { get; set; }

    [JsonPropertyName("attack")]
    public int Attack { get; set; }

    [JsonPropertyName("defense")]
    public int Defense { get; set; }

    [JsonPropertyName("attribute")]
    public PawnAttribute Attribute { get; set; }

    [JsonPropertyName("pawnType")]
    public PawnType PawnType { get; set; }

    [JsonPropertyName("currentPosition")]
    public string CurrentPosition { get; set; } = "Attack";

    [JsonPropertyName("hasAttacked")]
    public bool HasAttacked { get; set; }

    public Pawn(string id, string name) : base(id, name, CardType.Pawn)
    {
    }

    protected Pawn() { }
}
