using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.Fixtures
{
	public class _FixturesHeroViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
