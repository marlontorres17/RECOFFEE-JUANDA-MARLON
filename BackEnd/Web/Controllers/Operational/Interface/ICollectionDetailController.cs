using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface ICollectionDetailController
    {
        Task<ActionResult<IEnumerable<CollectionDetailDto>>> GetAll();
        Task<ActionResult<CollectionDetailDto>> GetById(int id);
        Task<IActionResult> Add(CollectionDetailDto collectionDetailDto);
        Task<IActionResult> Update(CollectionDetailDto collectionDetailDto);
        Task<IActionResult> Delete(int id);
    }
}
