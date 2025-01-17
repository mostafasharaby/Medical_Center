namespace AngularApi.Models
{
    public enum AppointmentStatusEnum
    {
        Active,    // 0
        Complete,  // 1
        Canceled   // 2
    }


    public class AppointmentStatus
    {
        public int Id { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
    }
}
