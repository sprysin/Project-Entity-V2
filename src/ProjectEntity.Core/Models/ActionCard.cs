namespace ProjectEntity.Core.Models;

public enum ActionSpeed
{
    Normal,
    Fast,
    Lingering
}

public abstract class ActionCard : Card
{
    public ActionSpeed Speed { get; set; }

    public ActionCard(string id, string name, ActionSpeed speed) : base(id, name, CardType.Action)
    {
        Speed = speed;
    }

    protected ActionCard() { }
}
