using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class Harvest :BaseEntity
    {
        public DateTime Date { get; set; }
        public double? KiloPrice { get; set; }
        

        public int LotId { get; set; }
        public Lot Lot {  get; set; } 
    }
}
