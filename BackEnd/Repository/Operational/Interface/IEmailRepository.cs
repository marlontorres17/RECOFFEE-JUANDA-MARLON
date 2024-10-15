using Entity.Model.Operational;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Operational.Interface
{
    public interface IEmailRepository
    {
        void AddEmail(Email email);
    }
}
