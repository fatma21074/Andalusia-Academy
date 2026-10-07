using System.ComponentModel.DataAnnotations;

namespace Application.Common
{
    public class PaginationParams
    {
        private const int MaxPageSize = 100;
        private int _pageSize = 20;

        // [ApiController] returns 400 automatically when these ranges are violated,
        // so page=0 or pageSize=-1 never reach Skip()/Take().
        [Range(1, 10000, ErrorMessage = "Page must be 1 or greater.")]
        public int Page { get; set; } = 1;

        // Values above the max are clamped; values below 1 are rejected with 400.
        [Range(1, int.MaxValue, ErrorMessage = "PageSize must be 1 or greater.")]
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
    }
}
