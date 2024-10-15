using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Operational
{
    public class BenefitDto : BaseDto
    {
    
        public string Name { get; set; }
        public string Description { get; set; }
        public string Cost { get; set; }

        public int FarmId { get; set; }
       
    }
}
