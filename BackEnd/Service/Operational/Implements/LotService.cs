using AutoMapper;
using Entity.DTO.Operational;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Implements
{
    public class LotService : ILotService
    {
        private readonly ILotRepository _lotRepository;
        private readonly IMapper _mapper;

        public LotService(ILotRepository lotRepository, IMapper mapper)
        {
            _lotRepository = lotRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LotDto>> GetAll()
        {
            var lots = await _lotRepository.GetAll();
            return _mapper.Map<IEnumerable<LotDto>>(lots);
        }

        public async Task<LotDto> GetById(int id)
        {
            var lot = await _lotRepository.GetById(id);
            return _mapper.Map<LotDto>(lot);
        }

        public async Task Add(LotDto lotDto)
        {
            var lot = _mapper.Map<Lot>(lotDto);
            await _lotRepository.Add(lot);
        }

        public async Task Update(LotDto lotDto)
        {
            var lot = _mapper.Map<Lot>(lotDto);
            await _lotRepository.Update(lot);
        }

        public async Task Delete(int id)
        {
            await _lotRepository.Delete(id);
        }
    }
}
