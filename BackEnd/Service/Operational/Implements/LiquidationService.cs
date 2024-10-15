using AutoMapper;
using Entity.DTO.Operational;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using Repository.Security.Implements;
using Repository.Security.Interface;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Operational.Implements
{
    public class LiquidationService : ILiquidationService
    {
        private readonly ILiquidationRepository _liquidationRepository;
        private readonly ICollectionDetailRepository _collectionDetailRepository;
        private readonly IPersonBenefitRepository _personBenefitRepository;
        private readonly IHarvestRepository _harvestRepository;
        private readonly IPersonRepository _personRepository;
        private readonly IMapper _mapper;

        public LiquidationService(
            ILiquidationRepository liquidationRepository,
            ICollectionDetailRepository collectionDetailRepository,
            IPersonBenefitRepository personBenefitRepository,
            IPersonRepository personRepository,
            IHarvestRepository harvestRepository,
            IMapper mapper)
        {
            _liquidationRepository = liquidationRepository;
            _collectionDetailRepository = collectionDetailRepository;
            _personBenefitRepository = personBenefitRepository;
            _harvestRepository = harvestRepository;
            _personRepository = personRepository;
            _mapper = mapper; 
        }

        public async Task<IEnumerable<LiquidationDto>> GetAll()
        {
            var liquidations = await _liquidationRepository.GetAll();
            return _mapper.Map<IEnumerable<LiquidationDto>>(liquidations);
        }

        public async Task<LiquidationDto> GetById(int id)
        {
            var liquidation = await _liquidationRepository.GetById(id);
            return _mapper.Map<LiquidationDto>(liquidation);
        }

        public async Task Add(LiquidationDto liquidationDto)
        {
            var liquidation = _mapper.Map<Liquidation>(liquidationDto);

            // Obtener todos los detalles de recolección de la persona
            var collectionDetails = await _collectionDetailRepository.GetAll();
            var personCollections = collectionDetails.Where(cd => cd.PersonId == liquidationDto.PersonId);

            double totalKilo = 0;
            double totalRecoleccion = 0;

            foreach (var collectionDetail in personCollections)
            {
                // Obtener el KiloPrice del Harvest correspondiente
                var harvest = await _harvestRepository.GetById(collectionDetail.HarvestId);
                if (harvest != null)
                {
                    totalKilo += collectionDetail.Kilo;
                    totalRecoleccion += collectionDetail.Kilo * harvest.KiloPrice.GetValueOrDefault(); // Usar GetValueOrDefault para manejar null
                }
            }

            liquidation.TotalKilo = totalKilo;

            // Obtener todos los beneficios de la persona
            var personBenefits = await _personBenefitRepository.GetAll();
            var personBenefitsFiltered = personBenefits.Where(pb => pb.PersonId == liquidationDto.PersonId);

            double totalBenefit = personBenefitsFiltered.Sum(pb => pb.Price.GetValueOrDefault()); // Usar GetValueOrDefault para manejar null

            liquidation.TotalBenefit = totalBenefit;
            liquidation.TotalPay = totalRecoleccion - totalBenefit;

            await _liquidationRepository.Add(liquidation);
        }

        public async Task Update(LiquidationDto liquidationDto)
        {
            var liquidation = _mapper.Map<Liquidation>(liquidationDto);
            await _liquidationRepository.Update(liquidation);
        }

        public async Task Delete(int id)
        {
            await _liquidationRepository.Delete(id);
        }

        public async Task<List<Liquidation>> GetLiquidationsByPersonIdAsync(int personId)
        {
            return await _liquidationRepository.GetLiquidationsByPersonIdAsync(personId);

        }
         public async Task<IEnumerable<LiquidationDto>> GetLiquidationsByFarmIdAsync(int farmId)
        {
            var liquidations = await _liquidationRepository.GetLiquidationsByFarmIdAsync(farmId);

            if (liquidations == null || !liquidations.Any())
            {
                throw new Exception("No se encontraron liquidaciones para esta finca."); // Manejo de la ausencia de datos
            }

            // Mapeamos las liquidaciones a LiquidationDto
            return _mapper.Map<IEnumerable<LiquidationDto>>(liquidations);
        }



    }
}
