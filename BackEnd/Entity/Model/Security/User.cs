﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model.Security
{
    public class User : BaseEntity
    {
      
        public string UserName { get; set; }
        public string Password { get; set; }

        public int PersonId { get; set; }
        public Person Person { get; set; }

        public string? ResetCode { get; set; } // Código de restablecimiento
        public DateTime? ResetCodeExpiration { get; set; }



    }
}
