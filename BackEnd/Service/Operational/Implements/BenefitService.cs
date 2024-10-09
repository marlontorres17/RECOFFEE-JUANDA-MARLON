using AutoMapper;
using Entity.DTO.Operational;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Implements
{
    public class BenefitService : IBenefitService
    {
        private readonly IBenefitRepository _benefitRepository;
        private readonly IMapper _mapper;

        public BenefitService(IBenefitRepository benefitRepository, IMapper mapper)
        {
            _benefitRepository = benefitRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BenefitDto>> GetAll()
        {
            var benefits = await _benefitRepository.GetAll();
            return _mapper.Map<IEnumerable<BenefitDto>>(benefits);
        }

        public async Task<BenefitDto> GetById(int id)
        {
            var benefit = await _benefitRepository.GetById(id);
            return _mapper.Map<BenefitDto>(benefit);
        }

        public async Task Add(BenefitDto benefitDto)
        {
            var benefit = _mapper.Map<Benefit>(benefitDto);
            await _benefitRepository.Add(benefit);
        }

        public async Task Update(BenefitDto benefitDto)
        {
            var benefit = _mapper.Map<Benefit>(benefitDto);
            await _benefitRepository.Update(benefit);
        }

        public async Task Delete(int id)
        {
            await _benefitRepository.Delete(id);
        }
    }
}
