using ProjectEntity.Core.Interfaces;
using ProjectEntity.Core.Models;
using System.Collections.Generic;

namespace ProjectEntity.Core.Systems;

public static class CardEffectLibrary
{
    private static Dictionary<string, IEffect> _effects = new();

    // No static constructor needed if we use direct instantiation or explicit registration
    // static CardEffectLibrary() { ... }

    public static void RegisterEffect(IEffect effect)
    {
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

        public void Execute(IGameContext context, object source)
        {
            // Apply to Active Player
            context.ModifyPlayerLifePoints(context.ActivePlayerIndex, _amount);
        }

    }

    public class DamagePlayerEffect : IEffect
    {
        public string Name => $"Deal {_damage} Damage";
        private int _damage;

        public DamagePlayerEffect(int damage)
        {
            _damage = damage;
        }

        public void Execute(IGameContext context, object source)
        {
            int opponent = context.GetOpponentIndex(context.ActivePlayerIndex);
            context.DamagePlayer(opponent, _damage);
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
        }

        public void Execute(IGameContext context, object source)
        {
            // Logic for High King: Target logic needed
            // context.ModifyPawnStat(...);
        }
    }
}
