using ProjectEntity.Core.Models;
using ProjectEntity.Core.Systems;

namespace ProjectEntity.Core.Cards.Pawns;

public class SolsticeSentinel : Pawn
{
    public SolsticeSentinel() : base("solstice_sentinel", "Solstice Sentinel")
    {
        Level = 4;
        Attack = 120;
        Defense = 100;
        Attribute = PawnAttribute.Light;
        PawnType = PawnType.Mechanical;
        EffectText = "When this card is summoned gain 100 lifepoints.";

        // "Grab" the effect from the library or instantiate it
        // In a real scenario, we might query the library by ID/Name
        // For now, directly instantiating utilizing the library's inner class to show connection

        Effects.Add(new CardEffectLibrary.GainLifePointsEffect(100));
    }
}
