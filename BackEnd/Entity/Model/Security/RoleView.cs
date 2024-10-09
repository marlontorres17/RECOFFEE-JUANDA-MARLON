using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Security
{
    public class RoleView : BaseEntity
    { 
       

        public int RoleId { get; set; }
        public Role Role { get; set; }

        public int ViewId {  get; set; }
        public View View { get; set; }

      
    }
}
