using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Security
{
    public class View : BaseEntity
    {
  
        public string Name { get; set; }
        public string Description { get; set; }
        public string Route { get; set; }

        public int ModuleId { get; set; }
        public Module Module { get; set; }

    }
}
