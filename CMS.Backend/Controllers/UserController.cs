using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách người dùng
        public IActionResult Index()
        {
            var userList = _context.Users.ToList();
            return View(userList);
        }

        // GET: User/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: User/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CMS.Data.Entities.User user)
        {
            if (ModelState.IsValid)
            {
                if (_context.Users.Any(u => u.Username == user.Username))
                {
                    ModelState.AddModelError("Username", "Tên đăng nhập này đã tồn tại!");
                    return View(user);
                }
                
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
                
                _context.Add(user);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        // GET: User/Edit/5
        public IActionResult Edit(int? id)
        {
            if (id == null) return NotFound();

            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, CMS.Data.Entities.User user)
        {
            if (id != user.Id) return NotFound();

            if (ModelState.IsValid)
            {
                // Kiểm tra trùng username (trừ chính user đang sửa)
                if (_context.Users.Any(u => u.Username == user.Username && u.Id != id))
                {
                    ModelState.AddModelError("Username", "Tên đăng nhập này đã tồn tại!");
                    return View(user);
                }

                // Nếu mật khẩu không bắt đầu bằng $2 (tức là người dùng vừa nhập mật khẩu mới chưa mã hóa)
                if (!string.IsNullOrEmpty(user.PasswordHash) && !user.PasswordHash.StartsWith("$2"))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
                }

                _context.Update(user);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        // GET: User/Delete/5
        public IActionResult Delete(int? id)
        {
            if (id == null) return NotFound();

            var user = _context.Users.FirstOrDefault(m => m.Id == id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: User/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
            }
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
    }
}