
using System.Text.Json.Serialization;

namespace AngularApi.Models
{
    public class DoctorSpecialization
    {
        public int Id { get; set; }
        public string? DoctorId { get; set; }
        public int?SpecializationId { get; set; }

        [JsonIgnore]
        public Doctor? Doctor { get; set; } = null!;
        public Specialization? Specialization { get; set; } = null!;
    }
}
