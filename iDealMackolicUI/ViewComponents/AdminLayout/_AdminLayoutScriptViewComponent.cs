using Microsoft.AspNetCore.Mvc;

namespace iDealMackolicUI.ViewComponents.AdminLayout
{
	public class _AdminLayoutScriptViewComponent : ViewComponent
	{
		public IViewComponentResult Invoke()
		{
			return View();
		}
	}
}
