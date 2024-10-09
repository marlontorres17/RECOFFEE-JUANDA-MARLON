using Entity.Model.Operational;
using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Operational
{
    public class CollectionDetailDto : BaseDto
    {
    
        public double Kilo { get; set; }
        public string Stage { get; set; }
        

        public int PersonId { get; set; }
 

        public int HarvestId { get; set; }
    
    }
}
