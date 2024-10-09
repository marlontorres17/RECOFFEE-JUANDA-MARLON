using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class Lot : BaseEntity
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public double SizeMeters { get; set; }

        public int? FarmId { get; set; }
        public Farm Farm { get; set; }
    }
}
