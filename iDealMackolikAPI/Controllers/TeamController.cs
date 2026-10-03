using iDealMackolikAPI.Context;
using iDealMackolikAPI.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iDealMackolikAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TeamController : ControllerBase
	{
		private readonly ApiContext _context;

		public TeamController(ApiContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult GetAllTeams()
		{
			var values = _context.Teams.ToList();
			return Ok(values);
		}
		[HttpPost]
		public IActionResult CreateTeam(Team team)
		{
			_context.Teams.Add(team);
			_context.SaveChanges();
			return Ok("Takım eklendi.");
		}
	}
}
