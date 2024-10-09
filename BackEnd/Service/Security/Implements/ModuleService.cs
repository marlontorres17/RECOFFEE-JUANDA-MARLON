using AutoMapper;
using Entity.DTO.Security;
using Entity.Model.Security;
using Repository.Security.Interface;
using Service.Security.Interface;

namespace Service.Security.Implements
{
    public class ModuleService : IModuleService
    {
        private readonly IModuleRepository _moduleRepository;
        private readonly IMapper _mapper;

        public ModuleService(IModuleRepository moduleRepository, IMapper mapper)
        {
            _moduleRepository = moduleRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ModuleDto>> GetAll()
        {
            var modules = await _moduleRepository.GetAll();
            return _mapper.Map<IEnumerable<ModuleDto>>(modules);
        }

        public async Task<ModuleDto> GetById(int id)
        {
            var module = await _moduleRepository.GetById(id);
            return _mapper.Map<ModuleDto>(module);
        }

        public async Task Add(ModuleDto moduleDto)
        {
            var module = _mapper.Map<Module>(moduleDto);
            await _moduleRepository.Add(module);
        }

        public async Task Update(ModuleDto moduleDto)
        {
            var module = _mapper.Map<Module>(moduleDto);
            await _moduleRepository.Update(module);
        }

        public async Task Delete(int id)
        {
            await _moduleRepository.Delete(id);
        }
    }
}
