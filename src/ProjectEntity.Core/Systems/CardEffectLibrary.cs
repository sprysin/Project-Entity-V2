using ProjectEntity.Core.Interfaces;
using ProjectEntity.Core.Models;
using System.Collections.Generic;

namespace ProjectEntity.Core.Systems;

public static class CardEffectLibrary
{
    private static Dictionary<string, IEffect> _effects = new();

    static CardEffectLibrary()
    {
        // Initialize standard effects
        RegisterEffect(new GainLifePointsEffect(100)); // Example reuse
    }

    public static void RegisterEffect(IEffect effect)
    {
        // Simple registration by name for now, could use ID
        if (!_effects.ContainsKey(effect.Name))
        {
            _effects[effect.Name] = effect;
        }
    }

    public static IEffect? GetEffect(string name)
    {
        return _effects.GetValueOrDefault(name);
    }

    // specific effect implementations

    public class GainLifePointsEffect : IEffect
    {
        public string Name => $"Gain {_amount} Life Points";

        private int _amount;

        public GainLifePointsEffect(int amount)
        {
            _amount = amount;
        }

        public void Execute(object gameState, object source)
        {
            // debug: Console.WriteLine($"[Effect] Player gains {_amount} Life Points.");
            // Logic to actually add LP to player in GameState would go here
        }

    }

    public class DamagePlayerEffect : IEffect
    {
        public string Name => $"Deal {_damage} Damage";
        private int _damage;

        public DamagePlayerEffect(int damage)
        {
            _damage = damage;
            CardEffectLibrary.RegisterEffect(this);
        }

        public void Execute(object gameState, object source)
        {
            // debug: Console.WriteLine($"[Effect] Deal {_damage} damage to opponent.");
        }
    }

    public class ModifyStatEffect : IEffect
    {
        public string Name => $"Modify Stat by {_amount}";
        private int _amount;
        private string _statName; // "ATK" or "DEF"

        public ModifyStatEffect(int amount, string statName)
        {
            _amount = amount;
            _statName = statName;
            CardEffectLibrary.RegisterEffect(this);
        }

        public void Execute(object gameState, object source)
        {
            // debug: Console.WriteLine($"[Effect] Target gains {_amount} {_statName}.");
        }
    }
}
