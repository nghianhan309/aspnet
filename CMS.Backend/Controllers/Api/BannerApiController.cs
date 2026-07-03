using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannerApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetActiveBanners()
        {
            var banners = _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.ImageUrl,
                    b.Link
                })
                .ToList();

            return Ok(banners);
        }
    }
}
