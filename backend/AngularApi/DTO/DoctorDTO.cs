namespace AngularApi.DTO
{
    public class DoctorDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Image { get; set; }
        public string? ProfessionalStatement { get; set; }
        public DateTime? PracticingFrom { get; set; }
        public List<string>? Specializations { get; set; }
    }
}
