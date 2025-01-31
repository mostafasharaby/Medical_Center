namespace AngularApi.Services
{
    public class EmailTemplateService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public EmailTemplateService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public string GetConfirmationEmail(string userName, string confirmationLink)
        {
            var templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "EmailTemplates", "ConfirmationEmail.html");
            var emailTemplate = File.ReadAllText(templatePath);

            var emailBody = emailTemplate
                .Replace("{{UserName}}", userName)
                 .Replace("{{ConfirmationLink}}", confirmationLink);

            return emailBody;
        }
        public string GetAppointmentConfirmationEamil(string patientName , string DoctorName , string date)
        {
            var templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "EmailTemplates", "ConfirmAppointment.html");
            var emailTemplate = File.ReadAllText(templatePath);

            var emailBody = emailTemplate
                .Replace("{{patientName}}", patientName)
                 .Replace("{{DoctorName}}", DoctorName)
                  .Replace("{{date}}", date);


            return emailBody;
        }
    }
}
