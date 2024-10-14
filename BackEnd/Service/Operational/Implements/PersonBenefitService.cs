using AutoMapper;
using Entity.DTO;
using Entity.DTO.Operational;
using Entity.Model.Operational;
using Repository.Operational.Implements;
using Repository.Operational.Interface;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Implements
{
    public class PersonBenefitService : IPersonBenefitService
    {
        private readonly IPersonBenefitRepository _personBenefitRepository;
        private readonly IBenefitRepository _benefitRepository;
        private readonly IMapper _mapper;

        public PersonBenefitService(IPersonBenefitRepository personBenefitRepository, IBenefitRepository benefitRepository, IMapper mapper)
        {
            _personBenefitRepository = personBenefitRepository;
            _benefitRepository = benefitRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PersonBenefitDto>> GetAll()
        {
            var personBenefits = await _personBenefitRepository.GetAll();
            return _mapper.Map<IEnumerable<PersonBenefitDto>>(personBenefits);
        }

        public async Task<PersonBenefitDto> GetById(int id)
        {
            var personBenefit = await _personBenefitRepository.GetById(id);
            return _mapper.Map<PersonBenefitDto>(personBenefit);
        }

        public async Task Add(PersonBenefitDto personBenefitDto)
        {
            // Obtener el beneficio seleccionado para obtener el costo
            var benefit = await _benefitRepository.GetById(personBenefitDto.BenefitId);
            if (benefit == null)
            {
                throw new Exception("Benefit not found");
            }

            // Cálculo del precio total
            double cost;
            if (!double.TryParse(benefit.Cost, out cost))
            {
                throw new Exception("Invalid benefit cost");
            }

            var totalPrice = cost * personBenefitDto.Amount;
            personBenefitDto.Price = totalPrice;

            var personBenefit = _mapper.Map<PersonBenefit>(personBenefitDto);
            await _personBenefitRepository.Add(personBenefit);
        }

        public async Task Update(PersonBenefitDto personBenefitDto)
        {
            // Obtener el beneficio seleccionado para obtener el costo
            var benefit = await _benefitRepository.GetById(personBenefitDto.BenefitId);
            if (benefit == null)
            {
                throw new Exception("Benefit not found");
            }

            // Cálculo del precio total
            double cost;
            if (!double.TryParse(benefit.Cost, out cost))
            {
                throw new Exception("Invalid benefit cost");
            }

            var totalPrice = cost * personBenefitDto.Amount;
            personBenefitDto.Price = totalPrice;

            var personBenefit = _mapper.Map<PersonBenefit>(personBenefitDto);
            await _personBenefitRepository.Update(personBenefit);
        }

        public async Task Delete(int id)
        {
            await _personBenefitRepository.Delete(id);
        }

        public async Task<List<PersonBenefit>> GetPersonBenefitsByPersonIdAsync(int personId)
        {
            return await _personBenefitRepository.GetPersonBenefitsByPersonIdAsync(personId);
        }

        public async Task<IEnumerable<UserPersonRoleDto>> GetCollectorsPersonsByFarmIdAsync(int farmId)
        {
           return await _personBenefitRepository.GetCollectorsPersonsByFarmIdAsync(farmId);
        }
    }
}
