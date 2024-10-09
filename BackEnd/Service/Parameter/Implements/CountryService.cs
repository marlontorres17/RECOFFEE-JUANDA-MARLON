using AutoMapper;
using Entity.DTO.Parameter;
using Entity.Model.Parameter;
using Repository.Parameter.Interface;
using Service.Parameter.Interface;

namespace Service.Parameter.Implements
{
    public class CountryService : ICountryService
    {
        private readonly ICountryRepository _countryRepository;
        private readonly IMapper _mapper;

        public CountryService(ICountryRepository countryRepository, IMapper mapper)
        {
            _countryRepository = countryRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CountryDto>> GetAll()
        {
            var countrys = await _countryRepository.GetAll();
            return _mapper.Map<IEnumerable<CountryDto>>(countrys);
        }

        public async Task<CountryDto> GetById(int id)
        {
            var country = await _countryRepository.GetById(id);
            return _mapper.Map<CountryDto>(country);
        }

        public async Task Add(CountryDto countryDto)
        {
            var country = _mapper.Map<Country>(countryDto);
            await _countryRepository.Add(country);
        }

        public async Task Update(CountryDto countryDto)
        {
            var country = _mapper.Map<Country>(countryDto);
            await _countryRepository.Update(country);
        }

        public async Task Delete(int id)
        {
            await _countryRepository.Delete(id);
        }
    }
}
