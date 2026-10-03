using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.AdminLayout
{
	public class _AdminTopbarViewComponent : ViewComponent
	{

		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
