using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Interface
{
    public interface IPersonBenefitRepository
    {
        Task<IEnumerable<PersonBenefit>> GetAll();
        Task<PersonBenefit> GetById(int id);
        Task Add(PersonBenefit personBenefit);
        Task Update(PersonBenefit personBenefit);
        Task Delete(int id);
    }
}
