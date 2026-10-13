namespace Application.Common
{
    public enum OperationStatus { Success, BadRequest, NotFound, Conflict }

    public class OperationResult<T>
    {
        public OperationStatus Status { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public static OperationResult<T> Ok(T data) =>
            new() { Status = OperationStatus.Success, Data = data };

        public static OperationResult<T> Fail(OperationStatus status, string message) =>
            new() { Status = status, Message = message };
    }
}