using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.Fixtures
{
	public class _FixturesScriptViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
