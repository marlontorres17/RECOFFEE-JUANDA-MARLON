using Entity.Model.Parameter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Parameter
{
    public class DepartmentDto : BaseDto
    {

        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }

        public int CountryId { get; set; }


    }
}
