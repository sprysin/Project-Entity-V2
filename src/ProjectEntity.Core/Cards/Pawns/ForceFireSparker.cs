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

        public void Execute(object gameState, object source)
        {
            // Placeholder: Logic to count opponent's set Action/Condition cards
            // int setCount = ((GameState)gameState).Opponent.Field.GetSetCards().Count(c => c is ActionCard || c is ConditionCard);
            // hardcoded for simulation for now until GameState is fully connected
            int setCount = 2; // Example: assume 2 set cards

            int damage = setCount * 10;

            // Reusing the library effect
            var damageEffect = new CardEffectLibrary.DamagePlayerEffect(damage);
            damageEffect.Execute(gameState, source);

            // Console.WriteLine($"[ForceFireSparker] Dealt {damage} damage for {setCount} set cards.");
        }
    }
}
