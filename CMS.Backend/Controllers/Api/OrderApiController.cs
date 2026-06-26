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
