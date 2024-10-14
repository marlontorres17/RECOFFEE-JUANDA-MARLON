using Entity.DTO;
using Entity.DTO.Operational;
using Entity.Model.Operational;
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
        Task<List<PersonBenefit>> GetPersonBenefitsByPersonIdAsync(int personId);
        Task<IEnumerable<UserPersonRoleDto>> GetCollectorsPersonsByFarmIdAsync(int farmId);
    }
}
