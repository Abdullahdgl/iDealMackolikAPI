using iDealMackolicUI.Dtos.LeagueDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace iDealMackolicUI.Controllers
{
	public class LeagueController : Controller
	{
		private readonly IHttpClientFactory _httpClientFactory;

		public LeagueController(IHttpClientFactory httpClientFactory)
		{
			_httpClientFactory = httpClientFactory;
		}

		public async Task<IActionResult> Index()
		{
			var client = _httpClientFactory.CreateClient();
			var response = await client.GetAsync("https://localhost:7155/api/League");

			var jsonData = await response.Content.ReadAsStringAsync();

			var values = JsonConvert.DeserializeObject<List<ResultLeagueDto>>(jsonData);

			return View(values);
		}
	}
}
