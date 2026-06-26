using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using System.Net.Mail;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/customer")]
    [ApiController]
    [Tags("Customer (Đăng ký / Đăng nhập)")]
    public class CustomerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;

        public CustomerApiController(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        // POST: api/customer/login
        [HttpPost("login")]
        [ProducesResponseType(typeof(Customer), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email && c.Password == request.Password);

            if (customer == null)
            {
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng" });
            }

            return Ok(new
            {
                success = true,
                message = "Đăng nhập thành công",
                data = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        // POST: api/customer/register
        [HttpPost("register")]
        [ProducesResponseType(typeof(Customer), StatusCodes.Status200OK)]
        public async Task<IActionResult> Register([FromBody] Customer customer)
        {
            if (await _context.Customers.AnyAsync(c => c.Email == customer.Email))
            {
                return BadRequest(new { success = false, message = "Email này đã được sử dụng" });
            }

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đăng ký thành công", customerId = customer.Id });
        }

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        // POST: api/customer/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (customer == null)
            {
                return BadRequest(new { success = false, message = "Email không tồn tại trong hệ thống" });
            }

            // Tạo mã OTP 6 số ngẫu nhiên
            Random random = new Random();
            string otpCode = random.Next(100000, 999999).ToString();

            // Lưu OTP vào cache với thời hạn 5 phút (Key là email)
            _cache.Set(request.Email, otpCode, TimeSpan.FromMinutes(5));

            // Log ra console để test nhanh ở local (do chưa cấu hình SMTP thật)
            Console.WriteLine($"\n========================================");
            Console.WriteLine($"[QUÊN MẬT KHẨU] Mã OTP cho email {request.Email} là: {otpCode}");
            Console.WriteLine($"========================================\n");

            try
            {
                using (var smtpClient = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtpClient.Credentials = new NetworkCredential("nghianhan30092k5@gmail.com", "giglpgngnlafipkp");
                    smtpClient.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("nghianhan30092k5@gmail.com", "NEXUS FRAGRANCE"),
                        Subject = "Mã OTP Đặt Lại Mật Khẩu - Nexus Fragrance",
                        Body = $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>
    <div style='background-color: #111; color: #fff; padding: 20px; text-align: center;'>
        <h2 style='margin: 0; font-family: Georgia, serif; font-weight: normal; letter-spacing: 2px;'>NEXUS FRAGRANCE</h2>
    </div>
    <div style='padding: 30px; background-color: #fff;'>
        <h3 style='color: #333; margin-top: 0;'>Xin chào,</h3>
        <p style='color: #555; line-height: 1.6;'>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản tại Nexus Fragrance. Vui lòng sử dụng mã OTP dưới đây để xác thực:</p>
        <div style='background-color: #f9f9f9; padding: 15px; text-align: center; border-radius: 8px; margin: 25px 0;'>
            <span style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111;'>{otpCode}</span>
        </div>
        <p style='color: #888; font-size: 13px; text-align: center;'>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
    </div>
    <div style='background-color: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px;'>
        &copy; {DateTime.Now.Year} Nexus Fragrance. All rights reserved.
    </div>
</div>",
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(request.Email);
                    await smtpClient.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi gửi mail: " + ex.Message);
            }

            return Ok(new { success = true, message = "Mã OTP đã được gửi. Vui lòng kiểm tra email (hoặc console)." });
        }

        public class VerifyOtpRequest
        {
            public string Email { get; set; }
            public string OtpCode { get; set; }
        }

        // POST: api/customer/verify-otp
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            if (_cache.TryGetValue(request.Email, out string savedOtp))
            {
                if (savedOtp == request.OtpCode)
                {
                    return Ok(new { success = true, message = "Xác thực OTP thành công" });
                }
            }

            return BadRequest(new { success = false, message = "Mã OTP không chính xác hoặc đã hết hạn" });
        }

        public class ResetPasswordRequest
        {
            public string Email { get; set; }
            public string OtpCode { get; set; }
            public string NewPassword { get; set; }
        }

        // POST: api/customer/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            // Cẩn thận kiểm tra lại OTP lần nữa trước khi đổi pass
            if (_cache.TryGetValue(request.Email, out string savedOtp))
            {
                if (savedOtp == request.OtpCode)
                {
                    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
                    if (customer != null)
                    {
                        customer.Password = request.NewPassword;
                        await _context.SaveChangesAsync();
                        
                        // Xóa cache OTP để không dùng lại được
                        _cache.Remove(request.Email);

                        return Ok(new { success = true, message = "Đặt lại mật khẩu thành công" });
                    }
                }
            }

            return BadRequest(new { success = false, message = "Phiên đặt lại mật khẩu không hợp lệ. Vui lòng thử lại từ đầu." });
        }

        // GET: api/customer/{id}
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Customer), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProfile(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy khách hàng" });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        public class UpdateProfileRequest
        {
            public string FullName { get; set; }
            public string Phone { get; set; }
            public string Address { get; set; }
        }

        // PUT: api/customer/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy khách hàng" });
            }

            customer.FullName = request.FullName;
            customer.Phone = request.Phone;
            customer.Address = request.Address;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Cập nhật thông tin thành công",
                data = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }
    }
}
