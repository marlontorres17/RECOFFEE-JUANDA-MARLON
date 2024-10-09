using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Security
{
    public class UserRoleDto : BaseDto
    {
        
        public int RoleId { get; set; }
        public int UserId { get; set; }


    }
}
