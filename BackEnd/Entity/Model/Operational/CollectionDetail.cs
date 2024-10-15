using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class CollectionDetail : BaseEntity
    {
        public double Kilo { get; set; }
        public string Stage { get; set; }
       

        public int PersonId { get; set; }
        public Person Person { get; set; }

        public int HarvestId { get; set; }
        public Harvest Harvest { get; set; }

    }
}
