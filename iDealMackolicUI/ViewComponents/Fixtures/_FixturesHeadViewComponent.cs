using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.Fixtures
{
	public class _FixturesHeadViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
