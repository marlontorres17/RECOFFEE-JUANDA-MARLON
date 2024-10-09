using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class PersonBenefit : BaseEntity
    {
        public DateTime Date {  get; set; }
        public double? Price { get; set; }
        public double Amount { get; set; }

        public int PersonId { get; set; }
        public Person Person { get; set; }

        public int BenefitId { get; set; }
        public Benefit Benefit { get; set; }
    }
}
