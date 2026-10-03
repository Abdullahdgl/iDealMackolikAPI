using iDealMackolicUI.Dtos.TeamDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace iDealMackolicUI.Controllers
{
	public class AdminTeamController : Controller
	{
		private readonly IHttpClientFactory _httpClientFactory;

		public AdminTeamController(IHttpClientFactory httpClientFactory)
		{
			_httpClientFactory = httpClientFactory;
		}

		public async Task<IActionResult> Index()
		{
			var client = _httpClientFactory.CreateClient();
			var responseMessage = await client.GetAsync("https://localhost:7155/api/Team");
			var jsonData = await responseMessage.Content.ReadAsStringAsync();
			var values = JsonConvert.DeserializeObject<List<ResultTeamDto>>(jsonData);
			return View(values);
		}

		[HttpGet]

		public IActionResult CreateTeam()
		{
			return View();
		}

		[HttpPost]
		public async Task<IActionResult> CreateTeam(CreateTeamDto dto)
		{
			var client = _httpClientFactory.CreateClient();
			var jsonData = JsonConvert.SerializeObject(dto);
			StringContent stringContent = new StringContent(jsonData, Encoding.UTF8, "application/json");
			await client.PostAsync("https://localhost:7155/api/Team",stringContent);

			return RedirectToAction("Index");
		}

	}
}
