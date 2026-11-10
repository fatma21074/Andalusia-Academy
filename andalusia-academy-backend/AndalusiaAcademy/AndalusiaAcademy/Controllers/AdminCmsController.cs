using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Application.DTOs;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/admin/testimonials")]
    [Authorize(Roles = "Admin")]
    public class AdminTestimonialsController : ControllerBase
    {
        private readonly TestimonialService _service;
        public AdminTestimonialsController(TestimonialService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<TestimonialDto>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<ActionResult<TestimonialDto>> Create(TestimonialCreateDto request) =>
            Ok(await _service.CreateAsync(request));

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, TestimonialCreateDto request)
        {
            var result = await _service.UpdateAsync(id, request);
            return result.Status == OperationStatus.Success ? Ok(result.Data) : NotFound(new { message = result.Message });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result.Status == OperationStatus.Success ? Ok(result.Data) : NotFound(new { message = result.Message });
        }
    }

    [ApiController]
    [Route("api/admin/partners")]
    [Authorize(Roles = "Admin")]
    public class AdminPartnersController : ControllerBase
    {
        private readonly PartnerService _service;
        public AdminPartnersController(PartnerService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<PartnerDto>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<ActionResult<PartnerDto>> Create(PartnerCreateDto request) =>
            Ok(await _service.CreateAsync(request));

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, PartnerCreateDto request)
        {
            var result = await _service.UpdateAsync(id, request);
            return result.Status == OperationStatus.Success ? Ok(result.Data) : NotFound(new { message = result.Message });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result.Status == OperationStatus.Success ? Ok(result.Data) : NotFound(new { message = result.Message });
        }
    }

    [ApiController]
    [Route("api/admin/faqs")]
    [Authorize(Roles = "Admin")]
    public class AdminFaqsController : ControllerBase
    {
        private readonly FaqService _service;
        public AdminFaqsController(FaqService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<FaqDto>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<ActionResult<FaqDto>> Create(FaqCreateDto request) =>
            Ok(await _service.CreateAsync(request));

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, FaqCreateDto request)
        {
            var result = await _service.UpdateAsync(id, request);
            return result.Status == OperationStatus.Success ? Ok(result.Data) : NotFound(new { message = result.Message });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result.Status == OperationStatus.Success ? Ok(result.Data) : NotFound(new { message = result.Message });
        }
    }
}