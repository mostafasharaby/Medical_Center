using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace AngularApi.Models
{
    public class Patient : IdentityUser
    {        
        public string?   Address { get; set; }
        [JsonIgnore]
        public ICollection<PatientReview>? PatientReview { get; set; } = new List<PatientReview>();
    }

}
