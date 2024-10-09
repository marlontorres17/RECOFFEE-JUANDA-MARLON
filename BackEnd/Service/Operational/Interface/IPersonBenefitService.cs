using Entity.DTO.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface IPersonBenefitService
    {
        Task<IEnumerable<PersonBenefitDto>> GetAll();
        Task<PersonBenefitDto> GetById(int id);
        Task Add(PersonBenefitDto personBenefitDto);
        Task Update(PersonBenefitDto personBenefitDto);
        Task Delete(int id);
    }
}
