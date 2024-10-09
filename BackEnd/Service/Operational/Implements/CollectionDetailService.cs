using AutoMapper;
using Entity.DTO.Operational;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Implements
{
    public class CollectionDetailService : ICollectionDetailService
    {
        private readonly ICollectionDetailRepository _collectionDetailRepository;
        private readonly IMapper _mapper;

        public CollectionDetailService(ICollectionDetailRepository collectionDetailRepository, IMapper mapper)
        {
            _collectionDetailRepository = collectionDetailRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CollectionDetailDto>> GetAll()
        {
            var collectionDetails = await _collectionDetailRepository.GetAll();
            return _mapper.Map<IEnumerable<CollectionDetailDto>>(collectionDetails);
        }

        public async Task<CollectionDetailDto> GetById(int id)
        {
            var collectionDetail = await _collectionDetailRepository.GetById(id);
            return _mapper.Map<CollectionDetailDto>(collectionDetail);
        }

        public async Task Add(CollectionDetailDto collectionDetailDto)
        {
            var collectionDetail = _mapper.Map<CollectionDetail>(collectionDetailDto);
            await _collectionDetailRepository.Add(collectionDetail);
        }

        public async Task Update(CollectionDetailDto collectionDetailDto)
        {
            var collectionDetail = _mapper.Map<CollectionDetail>(collectionDetailDto);
            await _collectionDetailRepository.Update(collectionDetail);
        }

        public async Task Delete(int id)
        {
            await _collectionDetailRepository.Delete(id);
        }
    }
}
