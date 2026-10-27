using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.DTOs;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestimonialsController : ControllerBase
    {
        private readonly TestimonialService _service;
        public TestimonialsController(TestimonialService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<TestimonialDto>>> Get() => Ok(await _service.GetPublishedAsync());
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PartnersController : ControllerBase
    {
        private readonly PartnerService _service;
        public PartnersController(PartnerService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<PartnerDto>>> Get() => Ok(await _service.GetPublishedAsync());
    }

    [ApiController]
    [Route("api/[controller]")]
    public class FaqsController : ControllerBase
    {
        private readonly FaqService _service;
        public FaqsController(FaqService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<FaqDto>>> Get() => Ok(await _service.GetPublishedAsync());
    }
}