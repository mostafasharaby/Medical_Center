using AngularApi.Models;

namespace AngularApi.DTO
{
    public class PatientDTO
    {
        public string? PatientId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Image { get; set; }
        public ICollection<PatientReview>? Reviews { get; set; } = new List<PatientReview>();

    }
}
