using Entity.DTO.Parameter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Parameter.Interface
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDto>> GetAll();
        Task<DepartmentDto> GetById(int id);
        Task Add(DepartmentDto departmentDto);
        Task Update(DepartmentDto departmentDto);
        Task Delete(int id);

    }
}
