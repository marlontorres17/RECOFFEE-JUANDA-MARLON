using Entity.Model.Security;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class Liquidation : BaseEntity
    {
    
        public double? TotalKilo {  get; set; }
    
        public double? TotalBenefit { get; set; }
        public double? TotalPay {  get; set; }

        public int PersonId { get; set; }
        public Person Person { get; set; }


    }
}
