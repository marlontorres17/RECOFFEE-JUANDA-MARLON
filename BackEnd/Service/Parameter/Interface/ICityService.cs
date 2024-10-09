using Entity.DTO.Parameter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Parameter.Interface
{
    public interface ICityService
    {
        Task<IEnumerable<CityDto>> GetAll();
        Task<CityDto> GetById(int id);
        Task Add(CityDto cityDto);
        Task Update(CityDto cityDto);
        Task Delete(int id);
    }
}
