using ProjectEntity.Core.Models;
using ProjectEntity.Core.Systems;

namespace ProjectEntity.Core.Cards.Pawns;

public class HighKingOfTheWest : Pawn
{
    public HighKingOfTheWest() : base("high_king_of_the_west", "High King of the West")
    {
        Level = 5;
        Attack = 170;
        Defense = 50;
        Attribute = PawnAttribute.Earth;
        PawnType = PawnType.Warrior;
        EffectText = "ON SUMMON: Target 1 face-up monster on the field; it loses 20 ATK.";

        // Adding the effect logic
        Effects.Add(new CardEffectLibrary.ModifyStatEffect(-20, "ATK"));
    }
}
