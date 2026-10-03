using iDealMackolicUI.Dtos.MatchDtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace iDealMackolicUI.Controllers
{
	public class MatchController : Controller
	{
		private readonly IHttpClientFactory _httpClientFactory;

		public MatchController(IHttpClientFactory httpClientFactory)
		{
			_httpClientFactory = httpClientFactory;
		}

		public async Task<IActionResult> Deneme()
		{
			return View();
		}

		public async Task<IActionResult> CreateMatch()
		{
			var client = _httpClientFactory.CreateClient();
			var response = await client.GetAsync("https://localhost:7155/api/Team");
			var json = await  response.Content.ReadAsStringAsync();
			var teams = JsonConvert.DeserializeObject<List<ResultTeamDto>>(json);
			ViewBag.Teams=teams;
			return View();
		}

		[HttpPost]
		public async Task<IActionResult> CreateMatch(CreateMatchDto dto)
		{
			var client = _httpClientFactory.CreateClient();

			var jsonData = JsonConvert.SerializeObject(dto);
			StringContent content = new StringContent(jsonData,Encoding.UTF8,"application/json");


			var response = await client.PostAsync("https://localhost:7155/api/Match",content);

			if (response.IsSuccessStatusCode)
			{
				return RedirectToAction("CreateMatch");
			}
			return View();
		}
		
		public async Task<IActionResult> MatchList()
		{
			var client = _httpClientFactory.CreateClient();

			var response = await client.GetAsync("https://localhost:7155/api/Match");

			var jsonData = await response.Content.ReadAsStringAsync();

			var values = JsonConvert.DeserializeObject<List<ResultMatchDto>>(jsonData);
			return View(values);

		}


		public async Task<IActionResult> matchDetail(int id)
		{
			var client = _httpClientFactory.CreateClient();

			//burada öncelikle maç detayını getireceğiz. a
			var response = await client.GetAsync($"https://localhost:7155/api/Match/{id}");

			var jsonData = await response.Content.ReadAsStringAsync();

			var value = JsonConvert.DeserializeObject<ResultMatchDetailDto>(jsonData);

			// burada ise maç olayları hakkındaki detayları getireceğiz.

			var eventResponse = await client.GetAsync($"https://localhost:7155/api/MatchEvent/{id}");
			var eventJson = await eventResponse.Content.ReadAsStringAsync();

			var events = JsonConvert.DeserializeObject(eventJson);

			ViewBag.Events = events;
			return View(value);


		}




	}
}
