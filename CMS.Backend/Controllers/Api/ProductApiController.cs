using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/product
        [HttpGet]
        [ProducesResponseType(typeof(List<Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null, 
            [FromQuery] int? categoryId = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] string? sortBy = "newest")
        {
            var query = _context.Products.Include(p => p.CategoryProduct).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || (p.Description != null && p.Description.Contains(search)));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (sortBy == "price_asc")
                query = query.OrderBy(p => p.Price);
            else if (sortBy == "price_desc")
                query = query.OrderByDescending(p => p.Price);
            else
                query = query.OrderByDescending(p => p.Id);

            var products = await query
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .ToListAsync();

            return Ok(new { success = true, data = products });
        }

        // GET: api/product/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryId = p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound(new { success = false, message = "Không tìm thấy sản phẩm" });

            return Ok(new { success = true, data = product });
        }

        // GET: api/ProductApi/latest
        [HttpGet("latest")]
        [ProducesResponseType(typeof(List<Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetLatestProducts([FromQuery] int count = 8)
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id) // Sắp xếp theo ID giảm dần (mới nhất)
                .Take(count)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .ToListAsync();

            return Ok(new { success = true, data = products });
        }

        // GET: api/ProductApi/search?keyword=abc
        [HttpGet("search")]
        [ProducesResponseType(typeof(List<Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchProducts([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return Ok(new { success = true, data = new List<object>() });

            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Name.Contains(keyword) || (p.Description != null && p.Description.Contains(keyword)))
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .ToListAsync();

            return Ok(new { success = true, data = products });
        }

        // GET: api/ProductApi/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        [ProducesResponseType(typeof(List<Product>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .ToListAsync();

            return Ok(new { success = true, data = products });
        }
    }
}
