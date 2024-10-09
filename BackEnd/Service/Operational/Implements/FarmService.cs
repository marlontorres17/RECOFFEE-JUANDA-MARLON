using AutoMapper;
using Entity.DTO.Operational;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Implements
{
    public class FarmService : IFarmService
    {
       
        private readonly IFarmRepository _farmRepository;
        private readonly IMapper _mapper;

        public FarmService(IFarmRepository farmRepository, IMapper mapper)
        {
            _farmRepository = farmRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FarmDto>> GetAll()
        {
            var farms = await _farmRepository.GetAll();
            return _mapper.Map<IEnumerable<FarmDto>>(farms);
        }

       

        public async Task<FarmDto> GetById(int id)
        {
            var farm = await _farmRepository.GetById(id);
            return _mapper.Map<FarmDto>(farm);
        }

        public async Task Add(FarmDto farmDto)
        {
            var farm = _mapper.Map<Farm>(farmDto);

            // Generar el código único automáticamente antes de guardar
            farm.codeUnique = GenerateUniqueCode();

            await _farmRepository.Add(farm);
        }

        public async Task Update(FarmDto farmDto)
        {
            var farm = _mapper.Map<Farm>(farmDto);
            await _farmRepository.Update(farm);
        }

        public async Task Delete(int id)
        {
            await _farmRepository.Delete(id);
        }

        // Método privado para generar un código único
        private string GenerateUniqueCode()
        {
            // Generar una parte de letras aleatorias (3 letras)
            string letters = GenerateRandomLetters(3);

            // Generar una parte de números aleatorios (3 dígitos)
            string numbers = new Random().Next(100, 999).ToString();

            // Combinar las partes en el formato deseado
            return $"{letters}-{numbers}";
        }

        // Método auxiliar para generar letras aleatorias
        private string GenerateRandomLetters(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<Farm> GetFarmByPersonIdAsync(int personId)
        {
            return await _farmRepository.GetFarmByPersonIdAsync(personId);
        }
    }
}
