using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Operational
{
    public class FarmDto : BaseDto
    {
       
        public string Name { get; set; }
        public string Description { get; set; }
        public double SizeMeter { get; set; }
        public string Coordinate { get; set; }
        public string? CodeUnique { get; set; }
        public int PersonId { get; set; }
  


        public int CityId { get; set; }

       
    }
}
