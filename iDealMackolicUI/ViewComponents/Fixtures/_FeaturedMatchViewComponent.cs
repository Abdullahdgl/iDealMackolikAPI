using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.Fixtures
{
	public class _FeaturedMatchViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
