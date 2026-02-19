namespace ProjectEntity.Core.Interfaces;

public interface IEffect
{
    string Name { get; }
    void Execute(IGameContext context, object source);
}
