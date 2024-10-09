using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Operational
{
    public class LiquidationDto : BaseDto
    {

      
        public double? TotalKilo { get; set; }

        public double? TotalBenefit { get; set; }
        public double? TotalPay { get; set; }

        public int PersonId { get; set; }

    }
}
