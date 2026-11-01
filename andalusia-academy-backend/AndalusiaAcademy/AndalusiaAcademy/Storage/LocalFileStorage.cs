using Application.Integrations;

namespace AndalusiaAcademy.Storage
{
    public class LocalFileStorage : IFileStorage
    {
        private readonly string _root; // <content root>/Uploads

        public LocalFileStorage(IWebHostEnvironment env)
        {
            _root = Path.Combine(env.ContentRootPath, "Uploads");
            Directory.CreateDirectory(_root);
        }

        public async Task<string> SaveAsync(Stream content, string originalFileName, string folder)
        {
            // Never trust the client's filename: keep only its extension and name the file ourselves.
            var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
            var storedName = $"{Guid.NewGuid():N}{extension}";

            var folderPath = Path.Combine(_root, folder);
            Directory.CreateDirectory(folderPath);

            var fullPath = Path.Combine(folderPath, storedName);
            await using var target = File.Create(fullPath);
            await content.CopyToAsync(target);

            return $"/uploads/{folder}/{storedName}";
        }

        public void Delete(string urlPath)
        {
            // Only ever delete inside our own Uploads folder.
            const string prefix = "/uploads/";
            if (!urlPath.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)) return;

            var relative = urlPath[prefix.Length..].Replace('/', Path.DirectorySeparatorChar);
            var fullPath = Path.GetFullPath(Path.Combine(_root, relative));
            var rootFull = Path.GetFullPath(_root) + Path.DirectorySeparatorChar;

            if (!fullPath.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase)) return; // path-traversal guard
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }
    }
}