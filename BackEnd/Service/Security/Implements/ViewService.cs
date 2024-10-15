using AutoMapper;
using Entity.DTO.Security;
using Entity.Model.Security;
using Repository.Security.Interface;
using Service.Security.Interface;

namespace Service.Security.Implements
{
    public class ViewService : IViewService
    {
        private readonly IViewRepository _viewRepository;
        private readonly IMapper _mapper;

        public ViewService(IViewRepository viewRepository, IMapper mapper)
        {
            _viewRepository = viewRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ViewDto>> GetAll()
        {
            var views = await _viewRepository.GetAll();
            return _mapper.Map<IEnumerable<ViewDto>>(views);
        }

        public async Task<ViewDto> GetById(int id)
        {
            var view = await _viewRepository.GetById(id);
            return _mapper.Map<ViewDto>(view);
        }

        public async Task Add(ViewDto viewDto)
        {
            var view = _mapper.Map<View>(viewDto);
            await _viewRepository.Add(view);
        }

        public async Task Update(ViewDto viewDto)
        {
            var view = _mapper.Map<View>(viewDto);
            await _viewRepository.Update(view);
        }

        public async Task Delete(int id)
        {
            await _viewRepository.Delete(id);
        }
    }
}
