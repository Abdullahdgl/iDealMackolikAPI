using iDealMackolicUI.Dtos.MatchDtos;
using iDealMackolicUI.Dtos.TeamDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace iDealMackolicUI.Controllers
{
	public class AdminMatchController : Controller
	{
		private readonly IHttpClientFactory _httpClientFactory;

		public AdminMatchController(IHttpClientFactory httpClientFactory)
		{
			_httpClientFactory = httpClientFactory;
		}

		[HttpGet]
		public async Task<IActionResult> CreateMatch()
		{
			var client =_httpClientFactory.CreateClient();
			var response = await client.GetAsync("https://localhost:7155/api/Team");
			var jsonData = await response.Content.ReadAsStringAsync();
			var teams = JsonConvert.DeserializeObject<List<Dtos.MatchDtos.ResultTeamDto>>(jsonData);
			ViewBag.Teams = teams;
			return View();

		}
		[HttpPost]
		public async Task<IActionResult> CreateMatch(CreateMatchDto dto)
		{
			var client = _httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(dto);

			StringContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");

			await client.PostAsync("https://localhost:7155/api/Match", content);

			return RedirectToAction("MatchList", "Match");
		}
	}
}
