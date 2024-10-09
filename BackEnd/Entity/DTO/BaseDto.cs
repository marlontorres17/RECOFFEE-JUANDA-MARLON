using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTO
{
    public abstract class BaseDto
    {
        public int Id { get; set; }
        public Boolean State { get; set; } = true;
    }
}
