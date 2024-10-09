using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Security
{
    public class Module : BaseEntity
    {
        
        public string  Name { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
   
    }
}
