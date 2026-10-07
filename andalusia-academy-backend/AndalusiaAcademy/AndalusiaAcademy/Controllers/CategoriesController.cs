using Microsoft.AspNetCore.Mvc;
using Application.Services;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _service;
        public CategoriesController(CategoryService service) => _service = service;

        // GET /api/categories
        // Feeds the Courses category filter and the homepage "Popular categories".
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application.DTOs.CategoryDto>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }
    }
}
