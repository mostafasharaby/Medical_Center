using Microsoft.AspNetCore.Identity;

namespace AngularApi.Models
{
    public class Patient : IdentityUser
    {        
        public string?   Address { get; set; }
        public ICollection<PatientReview>? PatientReview { get; set; } = new List<PatientReview>();
    }

}
