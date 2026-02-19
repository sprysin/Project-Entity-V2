namespace ProjectEntity.Core.Models;

public enum ConditionType
{
    Normal,
    Lingering
}

public abstract class ConditionCard : Card
{
    public ConditionType ConditionType { get; set; }

    public ConditionCard(string id, string name, ConditionType conditionType) : base(id, name, CardType.Condition)
    {
        ConditionType = conditionType;
    }

    protected ConditionCard() { }
}
