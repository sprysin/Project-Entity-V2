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
    public int Level { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
    public PawnAttribute Attribute { get; set; }
    public PawnType PawnType { get; set; }

    public Pawn(string id, string name) : base(id, name, CardType.Pawn)
    {
    }
}
