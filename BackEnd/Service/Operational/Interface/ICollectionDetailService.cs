using Entity.DTO.Operational;
using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface ICollectionDetailService
    {
        Task<IEnumerable<CollectionDetailDto>> GetAll();
        Task<CollectionDetailDto> GetById(int id);
        Task Add(CollectionDetailDto collectionDetailDto);
        Task Update(CollectionDetailDto collectionDetailDto);
        Task Delete(int id);
        Task<List<CollectionDetail>> GetCollectionDetailsByPersonIdAsync(int personId);
    }
}
