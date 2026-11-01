namespace Application.DTOs
{
    public class InstructorMaterialDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // link | file
        public string Url { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AddLinkMaterialDto
    {
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }
}