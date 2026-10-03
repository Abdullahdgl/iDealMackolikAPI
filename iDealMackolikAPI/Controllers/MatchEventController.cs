using iDealMackolikAPI.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace iDealMackolikAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class MatchEventController : ControllerBase
	{
		private readonly ApiContext _context;

		public MatchEventController(ApiContext context)
		{
			_context = context;
		}
		[HttpGet("{id}")]
		public async Task<IActionResult> GetMatchEvents(int id)
		{
			var values = await _context.MatchEvents
				.Where(x => x.MatchId == id)
				.OrderBy(x => x.Munite)
				.ToListAsync();
			return Ok(values);
		}
	}
}
