using AutoMapper;
using Entity.DTO.Parameter;
using Entity.Model.Parameter;
using Repository.Parameter.Implements;
using Repository.Parameter.Interface;
using Service.Parameter.Interface;

namespace Service.Parameter.Implements
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper _mapper;

        public DepartmentService(IDepartmentRepository departmentRepository, IMapper mapper)
        {
            _departmentRepository = departmentRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAll()
        {
            var departments = await _departmentRepository.GetAll();
            return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
        }

        public async Task<DepartmentDto> GetById(int id)
        {
            var department = await _departmentRepository.GetById(id);
            return _mapper.Map<DepartmentDto>(department);
        }

        public async Task Add(DepartmentDto departmentDto)
        {
            var department = _mapper.Map<Department>(departmentDto);
            await _departmentRepository.Add(department);
        }

        public async Task Update(DepartmentDto departmentDto)
        {
            var department = _mapper.Map<Department>(departmentDto);
            await _departmentRepository.Update(department);
        }

        public async Task Delete(int id)
        {
            await _departmentRepository.Delete(id);
        }
    }
}
