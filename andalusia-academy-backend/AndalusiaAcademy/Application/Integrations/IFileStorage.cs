namespace Application.Integrations
{
    public interface IFileStorage
    {
        // Saves the stream under a server-generated name and returns the public URL path,
        // e.g. /uploads/materials/3f2a9c....pdf
        Task<string> SaveAsync(Stream content, string originalFileName, string folder);

        void Delete(string urlPath);
    }
}