using Microsoft.AspNetCore.Mvc;
using ProjectEntity.Backend.Models;
using ProjectEntity.Backend.Services;

namespace ProjectEntity.Backend.Controllers;

[ApiController]
[Route("api/game")]
public class GameController : ControllerBase
{
    private readonly GameService _gameService;

    public GameController(GameService gameService)
    {
        _gameService = gameService;
    }

    [HttpPost("start")]
    public ActionResult<GameState> StartGame()
    {
        return Ok(_gameService.StartGame());
    }

    [HttpGet("state")]
    public ActionResult<GameState> GetState()
    {
        return Ok(_gameService.CurrentGame);
    }

    [HttpPost("action")]
    public ActionResult<GameState> ExecuteAction([FromBody] GameActionRequest request)
    {
        try
        {
            var newState = _gameService.ExecuteAction(request);
            return Ok(newState);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
