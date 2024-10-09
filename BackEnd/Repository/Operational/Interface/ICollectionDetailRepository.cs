using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Interface
{
    public interface ICollectionDetailRepository
    {
        Task<IEnumerable<CollectionDetail>> GetAll();
        Task<CollectionDetail> GetById(int id);
        Task Add(CollectionDetail collectionDetail);
        Task Update(CollectionDetail collectionDetail);
        Task Delete(int id);
    }
}
