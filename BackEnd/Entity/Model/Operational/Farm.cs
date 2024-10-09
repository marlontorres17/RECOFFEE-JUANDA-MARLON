using Entity.Model.Parameter;
using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class Farm : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public double SizeMeter { get; set; }
        public string Coordinate { get; set; }

        public string? codeUnique { get; set; }
      
        public int PersonId { get; set; }
        public Person Person { get; set; }

       

        public int CityId { get; set; }
        public City City { get; set; }
    }
}
