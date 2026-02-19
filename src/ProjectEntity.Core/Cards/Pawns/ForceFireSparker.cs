using ProjectEntity.Core.Interfaces;
using ProjectEntity.Core.Models;
using ProjectEntity.Core.Systems;

namespace ProjectEntity.Core.Cards.Pawns;

public class ForceFireSparker : Pawn
{
    public ForceFireSparker() : base("force_fire_sparker", "Force Fire Sparker")
    {
        Level = 2;
        Attack = 30;
        Defense = 150;
        Attribute = PawnAttribute.Fire;
        PawnType = PawnType.Demon;
        EffectText = "ON NORMAL SUMMON: Deal 10 damage for each set Action/Condition on opponent's field.";

        Effects.Add(new ForceFireSparkerEffect());
    }

    private class ForceFireSparkerEffect : IEffect
    {
        public string Name => "Spark Burn";

        public void Execute(IGameContext context, object source)
        {
            // Deal 10 damage for each set Action/Condition on opponent's field
            int opponent = context.GetOpponentIndex(context.ActivePlayerIndex);
            int count = context.CountFieldCards(opponent, c => c.Type == CardType.Action || c.Type == CardType.Condition && c.IsFaceDown);

            int damage = count * 10;
            if (damage > 0)
            {
                context.DamagePlayer(opponent, damage);
            }
        }
    }
}
