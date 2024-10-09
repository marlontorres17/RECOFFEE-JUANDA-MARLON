using Entity.DTO.Operational;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface IEmailService
    {
        void SendEmail(EmailDto emailDto);
    }
}
