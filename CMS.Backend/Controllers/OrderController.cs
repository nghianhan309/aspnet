using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách đơn hàng (kèm tên khách hàng và chi tiết)
        public IActionResult Index()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToList();
            return View(orders);
        }

        // GET: Order/Create
        public IActionResult Create()
        {
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        // POST: Order/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Order order)
        {
            ModelState.Remove("Customer");
            ModelState.Remove("OrderDetails");
            if (ModelState.IsValid)
            {
                order.OrderDate = DateTime.Now;
                _context.Add(order);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // GET: Order/Edit/5
        public IActionResult Edit(int? id)
        {
            if (id == null) return NotFound();

            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // POST: Order/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Order order)
        {
            if (id != order.Id) return NotFound();

            ModelState.Remove("Customer");
            ModelState.Remove("OrderDetails");
            if (ModelState.IsValid)
            {
                _context.Update(order);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // GET: Order/Delete/5
        public IActionResult Delete(int? id)
        {
            if (id == null) return NotFound();

            var order = _context.Orders.Include(o => o.Customer).FirstOrDefault(m => m.Id == id);
            if (order == null) return NotFound();

            return View(order);
        }

        // POST: Order/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
            }
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Order/Details/5
        public IActionResult Details(int? id)
        {
            if (id == null) return NotFound();

            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(m => m.Id == id);
                
            if (order == null) return NotFound();

            return View(order);
        }

        // POST: Order/DeleteDetail/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteDetail(int id)
        {
            var detail = _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefault(d => d.Id == id);

            if (detail != null)
            {
                // Hoàn lại số lượng tồn kho
                if (detail.Product != null)
                {
                    detail.Product.StockQuantity += detail.Quantity;
                }

                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();
            }

            // Quay lại trang trước đó (Index hoặc Details)
            string referer = Request.Headers["Referer"].ToString();
            if (!string.IsNullOrEmpty(referer))
            {
                return Redirect(referer);
            }
            return RedirectToAction(nameof(Index));
        }

        // POST: Order/UpdateDetailQuantity/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateDetailQuantity(int id, int newQuantity)
        {
            var detail = _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefault(d => d.Id == id);

            if (detail != null && newQuantity >= 0)
            {
                if (newQuantity == 0)
                {
                    // Xóa hoàn toàn (hoàn trả toàn bộ kho)
                    if (detail.Product != null)
                    {
                        detail.Product.StockQuantity += detail.Quantity;
                    }
                    _context.OrderDetails.Remove(detail);
                    _context.SaveChanges();
                    TempData["Success"] = "Đã xóa hoàn toàn sản phẩm khỏi đơn hàng!";
                }
                else
                {
                    int difference = detail.Quantity - newQuantity;
                    
                    if (difference != 0)
                    {
                        if (detail.Product != null)
                        {
                            // Nếu tăng số lượng (difference < 0), kiểm tra kho
                            if (difference < 0 && detail.Product.StockQuantity < Math.Abs(difference))
                            {
                                TempData["Error"] = $"Kho không đủ hàng! Sản phẩm '{detail.Product.Name}' chỉ còn {detail.Product.StockQuantity} cái.";
                                return RedirectToAction(nameof(Details), new { id = detail.OrderId });
                            }
                            
                            detail.Product.StockQuantity += difference; // Cộng lại phần chênh lệch vào kho
                        }

                        detail.Quantity = newQuantity;
                        _context.Update(detail);
                        _context.SaveChanges();
                        TempData["Success"] = "Đã cập nhật số lượng thành công!";
                    }
                }
            }

            return RedirectToAction(nameof(Details), new { id = detail?.OrderId });
        }
    }
}