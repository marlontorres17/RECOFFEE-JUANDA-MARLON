using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Operational.Interface
{
    public interface IEmailController
    {
        IActionResult SendEmail(EmailDto emailDto);
    }
}
