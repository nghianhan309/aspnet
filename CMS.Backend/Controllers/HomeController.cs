using System.Diagnostics;
using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            ViewBag.TotalProducts  = _context.Products.Count();
            ViewBag.TotalOrders    = _context.Orders.Count();
            ViewBag.TotalCustomers = _context.Customers.Count();
            ViewBag.TotalCategories = _context.CategoriesProducts.Count();

            ViewBag.PendingOrders  = _context.Orders.Count(o => o.Status == 0);
            ViewBag.ShippingOrders = _context.Orders.Count(o => o.Status == 1);
            ViewBag.DoneOrders     = _context.Orders.Count(o => o.Status == 2);

            // 5 đơn hàng gần nhất
            ViewBag.RecentOrders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .ToList();

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
