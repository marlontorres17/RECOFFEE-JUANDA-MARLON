using AutoMapper;
using Entity.DTO.Security;
using Entity.Model.Security;
using Repository.Security.Interface;
using Service.Security.Interface;

namespace Service.Security.Implements
{
    public class PersonService : IPersonService
    {
        private readonly IPersonRepository _personRepository;
        private readonly IMapper _mapper;

        public PersonService(IPersonRepository personRepository, IMapper mapper)
        {
            _personRepository = personRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PersonDto>> GetAll()
        {
            var persons = await _personRepository.GetAll();
            return _mapper.Map<IEnumerable<PersonDto>>(persons);
        }

        public async Task<PersonDto> GetById(int id)
        {
            var person = await _personRepository.GetById(id);
            return _mapper.Map<PersonDto>(person);
        }

        public async Task Add(PersonDto personDto)
        {
            var person = _mapper.Map<Person>(personDto);
            await _personRepository.Add(person);
        }

        public async Task Update(PersonDto personDto)
        {
            var person = _mapper.Map<Person>(personDto);
            await _personRepository.Update(person);
        }

        public async Task Delete(int id)
        {
            await _personRepository.Delete(id);
        }

        public async Task<IEnumerable<Person>> GetAdmins()
        {
            return await _personRepository.GetAdmins();
        }

        public bool IsEligibleForAgeRestriction(DateTime dateOfBirth)
        {
            var age = CalculateAge(dateOfBirth);
            return age >= 14;
        }

        public int CalculateAge(DateTime birthDate)
        {
            var today = DateTime.Today;
            var age = today.Year - birthDate.Year;
            if (birthDate > today.AddYears(-age)) age--;
            return age;
        }
    }
}
