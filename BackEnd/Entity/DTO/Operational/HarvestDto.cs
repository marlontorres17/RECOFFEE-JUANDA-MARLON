using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Operational
{
    public class HarvestDto : BaseDto
    {
     
        public DateTime Date { get; set; }
        public double? KiloPrice { get; set; }
        

        public int LotId { get; set; }

      
    }
}
