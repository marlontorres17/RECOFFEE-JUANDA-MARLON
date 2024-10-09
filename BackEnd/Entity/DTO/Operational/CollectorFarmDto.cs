using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Operational
{
    public class CollectorFarmDto : BaseDto

       
    {
        public int FarmId { get; set; } 
        public int PersonId { get; set; }
        public DateTime DateStart { get; set; }
    }
}
