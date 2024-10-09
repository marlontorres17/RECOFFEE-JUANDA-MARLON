using AutoMapper;
using Entity.DTO.Operational;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Implements
{
    public class HarvestService : IHarvestService
    {
        private readonly IHarvestRepository _harvestRepository;
        private readonly IMapper _mapper;

        public HarvestService(IHarvestRepository harvestRepository, IMapper mapper)
        {
            _harvestRepository = harvestRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<HarvestDto>> GetAll()
        {
            var harvests = await _harvestRepository.GetAll();
            return _mapper.Map<IEnumerable<HarvestDto>>(harvests);
        }

        public async Task<HarvestDto> GetById(int id)
        {
            var harvest = await _harvestRepository.GetById(id);
            return _mapper.Map<HarvestDto>(harvest);
        }

        public async Task Add(HarvestDto harvestDto)
        {
            var harvest = _mapper.Map<Harvest>(harvestDto);
            await _harvestRepository.Add(harvest);
        }

        public async Task Update(HarvestDto harvestDto)
        {
            var harvest = _mapper.Map<Harvest>(harvestDto);
            await _harvestRepository.Update(harvest);
        }

        public async Task Delete(int id)
        {
            await _harvestRepository.Delete(id);
        }
    }
}
