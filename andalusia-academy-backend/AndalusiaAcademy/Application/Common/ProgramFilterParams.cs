namespace Application.Common
{
    public class ProgramFilterParams : PaginationParams
    {
        public string? Search { get; set; }
    }

    public class CareerPathFilterParams : PaginationParams
    {
        public string? Search { get; set; }
    }
}