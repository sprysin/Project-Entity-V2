using System.Collections.Generic;

namespace ProjectEntity.Backend.Models;

public class GameActionRequest
{
    public string ActionType { get; set; } = string.Empty; // "Summon", "Set", "Activate", "Attack", "EndPhase", "Resolve"
    public int PlayerIndex { get; set; }
    public int HandIndex { get; set; }
    public int SlotIndex { get; set; }
    public int TargetSlotIndex { get; set; }
    public bool IsHidden { get; set; }
    public List<int> TributeIndices { get; set; } = new();
}
