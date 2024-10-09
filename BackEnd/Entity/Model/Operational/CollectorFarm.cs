using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class CollectorFarm : BaseEntity
    {
        public int FarmId { get; set; }
        public Farm Farm { get; set; }

        public int PersonId { get; set; }
        public Person Person { get; set; }

        public DateTime DateStart { get; set; }

    }
}
