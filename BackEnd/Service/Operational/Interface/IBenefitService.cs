using Entity.DTO.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface IBenefitService
    {
        Task<IEnumerable<BenefitDto>> GetAll();
        Task<BenefitDto> GetById(int id);
        Task Add(BenefitDto benefitDto);
        Task Update(BenefitDto benefitDto);
        Task Delete(int id);
    }
}
