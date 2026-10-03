using iDealMackolikAPI.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iDealMackolikAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class LeagueController : ControllerBase
	{
		private readonly ApiContext _context;

		public LeagueController(ApiContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult GetLeagueTable()
		{
			var values = _context.LeagueTables
				.OrderByDescending(x => x.Points)
				.ThenByDescending(x => x.GoalDifference)
				.Select(x => new
				{
					x.TeamId,
					TeamName = x.Team.TeamName,
					LogoUrl = x.Team.LogoUrl,
					x.Played,
					x.Won,
					x.Draw,
					x.Lost,
					x.GoalsFor,
					x.GoalsAgainst,
					x.GoalDifference,
					x.Points
				}).ToList();

				return Ok(values);
		}
	}
}
