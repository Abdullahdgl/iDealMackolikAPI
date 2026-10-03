using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.Fixtures
{
	public class _FixturesListViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
