
namespace AngularApi.Models
{
    public class DoctorSpecialization
    {
        public int Id { get; set; }
        public int? DoctorId { get; set; }
        public int?SpecializationId { get; set; }

        public Doctor? Doctor { get; set; } = null!;
        public Specialization? Specialization { get; set; } = null!;
    }
}
