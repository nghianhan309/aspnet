using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }

        // GET: CategoryProduct/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CategoryProduct/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CMS.Data.Entities.CategoryProduct categoryProduct)
        {
            ModelState.Remove("Products"); // Loại bỏ kiểm tra validate cho danh sách Products liên kết
            if (ModelState.IsValid)
            {
                _context.Add(categoryProduct);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }
    }
}