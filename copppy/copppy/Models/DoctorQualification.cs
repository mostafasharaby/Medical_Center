namespace AngularApi.Models
{
    public class DoctorQualification
    {
        public int Id { get; set; }
        public int? DoctorId { get; set; }
        public string? QualificationName { get; set; } = string.Empty;
        public string? InstituteName { get; set; } = string.Empty;
        public DateTime? ProcurementYear { get; set; }

        public Doctor? Doctor { get; set; } = null!;
    }
}
