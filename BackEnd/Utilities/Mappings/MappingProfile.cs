using Entity.DTO.Security;
using AutoMapper;
using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Entity.Model.Parameter;
using Entity.DTO.Parameter;
using Entity.DTO.Operational;
using Entity.Model.Operational;

namespace Utilities.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RoleDto, Role>().ReverseMap();
            CreateMap<ViewDto, View>().ReverseMap();
            CreateMap<RoleViewDto, RoleView>().ReverseMap();
            CreateMap<ModuleDto, Module>().ReverseMap();
            CreateMap<PersonDto, Person>().ReverseMap();
            CreateMap<UserDto, User>().ReverseMap();
            CreateMap<UserRoleDto, UserRole>().ReverseMap();
            CreateMap<CountryDto, Country>().ReverseMap(); 
            CreateMap<DepartmentDto, Department>().ReverseMap();
            CreateMap<CityDto, City>().ReverseMap();
            CreateMap<FarmDto, Farm>().ReverseMap();
            CreateMap<LotDto, Lot>().ReverseMap();
            CreateMap<BenefitDto, Benefit>().ReverseMap();
            CreateMap<HarvestDto, Harvest>().ReverseMap();
            CreateMap<CollectionDetailDto, CollectionDetail>().ReverseMap();
            CreateMap<LiquidationDto, Liquidation>().ReverseMap();
            CreateMap<PersonBenefitDto, PersonBenefit>().ReverseMap();
            CreateMap<CollectorFarmDto, CollectorFarm>().ReverseMap();
        }


    }
}
