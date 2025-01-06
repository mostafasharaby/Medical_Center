﻿namespace AngularApi.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string ?ProfessionalStatement { get; set; } = string.Empty;
        public DateTime?PracticingFrom { get; set; }

        public ICollection<DoctorSpecialization>? DoctorSpecializations { get; set; } = new List<DoctorSpecialization>();
        public ICollection<DoctorQualification>? Qualifications { get; set; } = new List<DoctorQualification>();
        public ICollection<HospitalAffiliation>? HospitalAffiliations { get; set; } = new List<HospitalAffiliation>();
    }
}