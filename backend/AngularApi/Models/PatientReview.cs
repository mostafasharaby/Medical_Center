namespace AngularApi.Models
{
    public class PatientReview
    {
        public int Id { get; set; }
        public string? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public bool? IsReviewAnonymous { get; set; }
        public int? WaitTimeRating { get; set; }
        public int? BedsideMannerRating { get; set; }
        public int? OverallRating { get; set; }
        public string? Review { get; set; } = string.Empty;
        public bool? IsDoctorRecommended { get; set; }
        public DateTime? ReviewDate { get; set; }

        public Patient? Patient { get; set; } = null!;
        public Doctor? Doctor { get; set; } = null!;
    }

}
