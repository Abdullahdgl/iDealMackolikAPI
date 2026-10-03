using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.AdminLayout
{
	public class _AdminLayoutHeadViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
