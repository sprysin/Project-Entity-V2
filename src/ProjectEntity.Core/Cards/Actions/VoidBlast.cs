using ProjectEntity.Core.Models;
using ProjectEntity.Core.Systems;

namespace ProjectEntity.Core.Cards.Actions;

public class VoidBlast : ActionCard
{
    public VoidBlast() : base("void_blast", "Void Blast", ActionSpeed.Normal)
    {
        EffectText = "Deal 50 damage to your opponent.";

        Effects.Add(new CardEffectLibrary.DamagePlayerEffect(50));
    }
}
