using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.AdminLayout
{
	public class _NavBarViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
