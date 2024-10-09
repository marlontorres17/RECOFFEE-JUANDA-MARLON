using Entity.Model.Context;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Operational.Implements
{
    public class EmailRepository : IEmailRepository
    {
        private readonly ApplicationDbContext _context;

        public EmailRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public void AddEmail(Email email)
        {
            _context.emails.Add(email); // Asegúrate de tener una DbSet<EmailEntity> en tu DbContext
            _context.SaveChanges();
        }
    }
}
