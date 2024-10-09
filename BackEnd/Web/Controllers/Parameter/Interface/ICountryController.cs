using Entity.DTO.Parameter;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Parameter.Interface
{
    public interface ICountryController
    {
        Task<ActionResult<IEnumerable<CountryDto>>> GetAll();
        Task<ActionResult<CountryDto>> GetById(int id);
        Task<IActionResult> Add(CountryDto countryDto);
        Task<IActionResult> Update(CountryDto countryDto);
        Task<IActionResult> Delete(int id);
    }
}
