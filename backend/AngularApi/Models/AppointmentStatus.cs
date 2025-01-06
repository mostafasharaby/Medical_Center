namespace AngularApi.Models
{
    public enum AppointmentStatusEnum
    {
        Active,
        Complete,
        Canceled
    }

    public class AppointmentStatus
    {
        public int Id { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
    }
}
