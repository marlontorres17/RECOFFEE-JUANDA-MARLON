using Entity.Model.Parameter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Parameter
{
    public class CityDto : BaseDto
    {
  
        public string Name { get; set; }
        public string Description { get; set; }

        public string Coordinate { get; set; }

        public int DepartmentId { get; set; }
        
  
    }
}
