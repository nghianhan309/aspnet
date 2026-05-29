//using CMS.Data.Entities;
//using Microsoft.AspNetCore.Mvc;
//using CMS.Data.Entities; // Kết nối tới lớp dữ liệu bạn vừa tạo
//namespace CMS.Backend.Controllers
//{
//    public class CategoryController : Controller
//    {
//        public IActionResult Index()
//        {
//            // Tạo danh sách dữ liệu mẫu trực tiếp trong code
//            var list = new List<Category> {
//            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
//            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
//        };
//            return View(list); // Gửi danh sách này sang giao diện
//        }
//    }

//}

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu thật từ SQL Server
            var list = _context.Categories.ToList();

            return View(list);
        }

        // GET: Category/Details/5
        public IActionResult Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = _context.Categories.FirstOrDefault(m => m.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // GET: Category/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Category/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Category category)
        {
            ModelState.Remove("Post");
            if (ModelState.IsValid)
            {
                _context.Add(category);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // GET: Category/Edit/5
        public IActionResult Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        // POST: Category/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Category category)
        {
            if (id != category.Id)
            {
                return NotFound();
            }

            ModelState.Remove("Post");
            if (ModelState.IsValid)
            {
                _context.Update(category);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // GET: Category/Delete/5
        public IActionResult Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = _context.Categories.FirstOrDefault(m => m.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // POST: Category/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
            }

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
    }
}
