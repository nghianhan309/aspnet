using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CMS.Backend.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            // Nếu đã đăng nhập thì chuyển luôn về Dashboard
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                ViewBag.Error = "Vui lòng nhập đầy đủ tài khoản và mật khẩu.";
                return View();
            }
            // Tìm user theo username
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user != null)
            {
                bool isPasswordValid = false;
                
                // Kiểm tra xem mật khẩu có phải là BCrypt hash không (BCrypt hash bắt đầu bằng $2)
                if (user.PasswordHash.StartsWith("$2"))
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                }
                else
                {
                    // Fallback: nếu đang lưu plain text thì kiểm tra plain text
                    if (user.PasswordHash == password)
                    {
                        isPasswordValid = true;
                        // Nâng cấp bảo mật: mã hóa lại mật khẩu thô và lưu vào DB
                        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                        await _context.SaveChangesAsync();
                    }
                }

                if (isPasswordValid)
                {
                // Tạo các claim cho user
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim("FullName", user.FullName ?? user.Username),
                    new Claim(ClaimTypes.Role, user.Role ?? "Editor")
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true, // Ghi nhớ đăng nhập
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30)
                };

                // Đăng nhập session
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme, 
                    new ClaimsPrincipal(claimsIdentity), 
                    authProperties);

                return RedirectToAction("Index", "Home");
            }
            }

            ViewBag.Error = "Tài khoản hoặc mật khẩu không chính xác.";
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Auth");
        }
        
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
