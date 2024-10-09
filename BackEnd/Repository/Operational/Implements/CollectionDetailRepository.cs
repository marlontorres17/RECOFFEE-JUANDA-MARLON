using Entity.Model.Context;
using Entity.Model.Operational;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Implements
{
    public class CollectionDetailRepository : ICollectionDetailRepository
    {
        private readonly ApplicationDbContext _context;

        public CollectionDetailRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CollectionDetail>> GetAll()
        {
            return await _context.collectionDetails.ToListAsync();
        }

        public async Task<CollectionDetail> GetById(int id)
        {
            return await _context.collectionDetails.FindAsync(id);
        }

        public async Task Add(CollectionDetail collectionDetail)
        {
            await _context.collectionDetails.AddAsync(collectionDetail);
            await _context.SaveChangesAsync();
        }

        public async Task Update(CollectionDetail collectionDetail)
        {
            _context.collectionDetails.Update(collectionDetail);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var collectionDetail = await _context.collectionDetails.FindAsync(id);
            if (collectionDetail != null)
            {
                _context.collectionDetails.Remove(collectionDetail);
                await _context.SaveChangesAsync();
            }
        }
    }
}
