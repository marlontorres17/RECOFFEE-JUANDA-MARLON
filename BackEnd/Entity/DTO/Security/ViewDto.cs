﻿using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO.Security
{
    public class ViewDto : BaseDto
    {
     
        public string Name { get; set; }
        public string Description { get; set; }
        public string Route { get; set; }

        public int ModuleId { get; set; }
   
    }
}
