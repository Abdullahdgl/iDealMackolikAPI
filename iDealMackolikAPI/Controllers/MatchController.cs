using iDealMackolikAPI.Context;
using iDealMackolikAPI.Dtos;
using iDealMackolikAPI.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iDealMackolikAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class MatchController : ControllerBase
	{
		private readonly ApiContext _context;
		public MatchController(ApiContext context)
		{
			_context = context;
		}

		[HttpPost]
		public IActionResult CreateMatch(CreateMatchDto createMatchDto)
		{
			var match = new Match
			{
				HomeTeamId = createMatchDto.HomeTeamId,
				AwayTeamId = createMatchDto.AwayTeamId,
				MatchDate = createMatchDto.MatchDate,
				Stadium = createMatchDto.Stadium,
				Status = 2,
				HomeScore = 0,
				AwayScore = 0,
			};

			_context.Matches.Add(match);
			_context.SaveChanges();
			return Ok("Maç EKlendi.");
		}

		[HttpGet]
		public IActionResult GetMatches()
		{
			var values = _context.Matches
				.Select(x => new
				{
					x.MatchId,
					HomeTeam = x.HomeTeam.TeamName,
					AwayTeam = x.AwayTeam.TeamName,

					HomeLogo = x.HomeTeam.LogoUrl,
					AwayLogo = x.AwayTeam.LogoUrl,
					x.MatchDate,
					x.Stadium,

					x.HomeScore,
					x.AwayScore,

					x.Week
				}).ToList();
			return Ok(values);
		}

		[HttpGet("{id}")]
		public IActionResult GetMatchById(int id)
		{
			var value = _context.Matches
				.Where(x => x.MatchId == id)
				.Select(x => new
				{
					x.MatchId,

					HomeTeam = x.HomeTeam.TeamName,
					AwayTeam = x.AwayTeam.TeamName,

					HomeLogo = x.HomeTeam.LogoUrl,
					AwayLogo = x.AwayTeam.LogoUrl,

					x.HomeScore,
					x.AwayScore,

					x.Status,
					x.MatchDate,

					x.Week
				}).FirstOrDefault();
			return Ok(value);
		}


	}
}
