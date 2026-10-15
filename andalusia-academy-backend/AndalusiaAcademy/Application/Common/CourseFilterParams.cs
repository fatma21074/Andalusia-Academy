namespace Application.Common
{
    public class CourseFilterParams : PaginationParams
    {
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public string? Status { get; set; }
        public string? SortBy { get; set; }   // "title" | "price" | "createdat" — whitelisted in the repository
        public string? Order { get; set; }    // "asc" | "desc"
    }
}