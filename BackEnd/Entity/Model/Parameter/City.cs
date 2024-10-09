using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Parameter
{
    public class City : BaseEntity
    {
        public string Name { get; set; }
        public string Coordinate { get; set; }

        public string Description { get; set; }

        public int DepartmentId { get; set; }
        public Department Department { get; set; }

        
    }
}
