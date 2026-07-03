using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class OrderItemRequest
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        public class OrderRequest
        {
            public int CustomerId { get; set; }
            public string? Notes { get; set; }
            public string? ShippingAddress { get; set; }
            public string? PhoneNumber { get; set; }
            public List<OrderItemRequest>? Items { get; set; }
        }

        // POST: api/order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            var customer = await _context.Customers.FindAsync(request.CustomerId);
            if (customer == null)
            {
                return BadRequest(new { success = false, message = "Khách hàng không tồn tại" });
            }

            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest(new { success = false, message = "Đơn hàng phải có ít nhất một sản phẩm" });
            }

            var order = new Order
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0, // 0: Chờ duyệt
                Notes = $"SDT: {request.PhoneNumber} | Địa chỉ: {request.ShippingAddress}" +
                        (string.IsNullOrEmpty(request.Notes) ? "" : $" | Ghi chú: {request.Notes}")
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Thêm chi tiết đơn hàng
            foreach (var item in request.Items)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                };
                _context.OrderDetails.Add(orderDetail);

                // Trừ bớt số lượng sản phẩm tồn kho
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    // Đảm bảo tồn kho không âm
                    if (product.StockQuantity < 0) product.StockQuantity = 0;
                    _context.Products.Update(product);
                }
            }

            await _context.SaveChangesAsync();

            // Lấy thông tin chi tiết để gửi email
            var orderDetailsForEmail = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.OrderId == order.Id)
                .ToListAsync();

            // Gửi email xác nhận đơn hàng
            try
            {
                using (var smtpClient = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587))
                {
                    smtpClient.Credentials = new System.Net.NetworkCredential("nghianhan30092k5@gmail.com", "giglpgngnlafipkp");
                    smtpClient.EnableSsl = true;

                    string productRows = "";
                    decimal totalAmount = 0;
                    foreach (var od in orderDetailsForEmail)
                    {
                        var productName = od.Product != null ? od.Product.Name : "Sản phẩm";
                        var subTotal = od.Quantity * od.UnitPrice;
                        totalAmount += subTotal;
                        productRows += $"<tr><td style='padding: 10px; border-bottom: 1px solid #ddd;'>{productName}</td><td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>{od.Quantity}</td><td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>{subTotal:N0}đ</td></tr>";
                    }

                    var mailMessage = new System.Net.Mail.MailMessage
                    {
                        From = new System.Net.Mail.MailAddress("nghianhan30092k5@gmail.com", "NEXUS FRAGRANCE"),
                        Subject = $"Xác Nhận Đơn Hàng #{order.Id} - Nexus Fragrance",
                        Body = $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>
    <div style='background-color: #111; color: #fff; padding: 20px; text-align: center;'>
        <h2 style='margin: 0; font-family: Georgia, serif; font-weight: normal; letter-spacing: 2px;'>NEXUS FRAGRANCE</h2>
    </div>
    <div style='padding: 30px; background-color: #fff;'>
        <h3 style='color: #333; margin-top: 0;'>Xin chào {customer.FullName},</h3>
        <p style='color: #555; line-height: 1.6;'>Cảm ơn bạn đã mua sắm tại Nexus Fragrance. Đơn hàng của bạn đã được hệ thống ghi nhận thành công và đang chờ xử lý.</p>
        
        <h4 style='border-bottom: 2px solid #D4AF37; padding-bottom: 5px; color: #333;'>Chi Tiết Đơn Hàng #{order.Id}</h4>
        <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <thead>
                <tr style='background-color: #f9f9f9;'>
                    <th style='padding: 10px; text-align: left; border-bottom: 2px solid #ddd;'>Sản phẩm</th>
                    <th style='padding: 10px; text-align: center; border-bottom: 2px solid #ddd;'>SL</th>
                    <th style='padding: 10px; text-align: right; border-bottom: 2px solid #ddd;'>Tạm tính</th>
                </tr>
            </thead>
            <tbody>
                {productRows}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan='2' style='padding: 10px; text-align: right; font-weight: bold;'>Tổng Cộng:</td>
                    <td style='padding: 10px; text-align: right; font-weight: bold; color: #D4AF37;'>{totalAmount:N0}đ</td>
                </tr>
            </tfoot>
        </table>

        <div style='background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;'>
            <p style='margin: 0 0 10px 0;'><strong>Địa chỉ giao hàng:</strong> {request.ShippingAddress}</p>
            <p style='margin: 0 0 10px 0;'><strong>Số điện thoại:</strong> {request.PhoneNumber}</p>
            <p style='margin: 0;'><strong>Ghi chú:</strong> {request.Notes ?? "Không có"}</p>
        </div>
    </div>
    <div style='background-color: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px;'>
        &copy; {DateTime.Now.Year} Nexus Fragrance. All rights reserved.
    </div>
</div>",
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(customer.Email);
                    await smtpClient.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi gửi mail đặt hàng: " + ex.Message);
            }

            return Ok(new { success = true, message = "Đặt hàng thành công!", orderId = order.Id });
        }

        // GET: api/order (Lấy tất cả đơn hàng)
        [HttpGet]
        [ProducesResponseType(typeof(List<Order>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    CustomerName = o.Customer != null ? o.Customer.FullName : "N/A",
                    TotalAmount = o.OrderDetails != null
                        ? o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice)
                        : 0,
                    ItemCount = o.OrderDetails != null ? o.OrderDetails.Count : 0
                })
                .ToListAsync();

            return Ok(new { success = true, data = orders });
        }

        // GET: api/order/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        [ProducesResponseType(typeof(List<Order>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    TotalAmount = o.OrderDetails != null
                        ? o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice)
                        : 0,
                    Items = o.OrderDetails.Select(od => new
                    {
                        od.ProductId,
                        ProductName = od.Product != null ? od.Product.Name : "N/A",
                        ProductImage = od.Product != null ? od.Product.ImageUrl : null,
                        od.Quantity,
                        od.UnitPrice
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new { success = true, data = orders });
        }
    }
}
