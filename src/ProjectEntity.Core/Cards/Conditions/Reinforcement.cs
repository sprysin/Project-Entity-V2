using ProjectEntity.Core.Models;
using ProjectEntity.Core.Systems;

namespace ProjectEntity.Core.Cards.Conditions;

public class Reinforcement : ConditionCard
{
    public Reinforcement() : base("reinforcement", "Reinforcement", ConditionType.Normal)
    {
        EffectText = "Target 1 pawn on the field, it gains +20 ATK.";
        
        Effects.Add(new CardEffectLibrary.ModifyStatEffect(20, "ATK"));
    }
}
