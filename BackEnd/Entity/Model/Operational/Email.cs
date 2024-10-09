using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Operational
{
    public class Email : BaseEntity
    {
        public string Name { get; set; }
        public string Gmail { get; set; }
        public string Message { get; set; }
    }
}
