using AutoMapper;
using Entity.DTO.Parameter;
using Entity.Model.Parameter;
using Repository.Parameter.Implements;
using Repository.Parameter.Interface;
using Service.Parameter.Interface;

namespace Service.Parameter.Implements
{
    public class CityService : ICityService
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;

        public CityService(ICityRepository cityRepository, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CityDto>> GetAll()
        {
            var citys = await _cityRepository.GetAll();
            return _mapper.Map<IEnumerable<CityDto>>(citys);
        }

        public async Task<CityDto> GetById(int id)
        {
            var city = await _cityRepository.GetById(id);
            return _mapper.Map<CityDto>(city);
        }

        public async Task Add(CityDto cityDto)
        {
            var city = _mapper.Map<City>(cityDto);
            await _cityRepository.Add(city);
        }

        public async Task Update(CityDto cityDto)
        {
            var city = _mapper.Map<City>(cityDto);
            await _cityRepository.Update(city);
        }

        public async Task Delete(int id)
        {
            await _cityRepository.Delete(id);
        }
    }
}
