using Entity.Model.Context;
using Microsoft.EntityFrameworkCore;
using Repository.Security.Implements;
using Repository.Security.Interface;
using Service.Security.Implements;
using Service.Security.Interface;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Web.Controller.Implements;
using Web.Controllers.Security.Interface;
using Utilities.Mappings;
using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Repository.Parameter.Implements;
using Repository.Parameter.Interface;
using Service.Parameter.Implements;
using Service.Parameter.Interface;
using Web.Controllers.Parameter.Interface;
using Repository.Operational.Interface;
using Repository.Operational.Implements;
using Service.Operational.Interface;
using Service.Operational.Implements;
using Web.Controllers.Operational.Interface;
using Web.Controllers.Operational.Implements;
using Web.Controllers.Operational;
using Web.Controllers.Security;



var builder = WebApplication.CreateBuilder(args);

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBDefaultConnection")));

// Registro de servicios en el contenedor
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IRoleController, RoleController>();

builder.Services.AddScoped<IViewRepository, ViewRepository>();
builder.Services.AddScoped<IViewService, ViewService>();
builder.Services.AddScoped<IViewController, ViewController>();

builder.Services.AddScoped<IRoleViewRepository, RoleViewRepository>();
builder.Services.AddScoped<IRoleViewService, RoleViewService>();
builder.Services.AddScoped<IRoleViewController, RoleViewController>();

builder.Services.AddScoped<IModuleRepository, ModuleRepository>();
builder.Services.AddScoped<IModuleService, ModuleService>();
builder.Services.AddScoped<IModuleController, ModuleController>();

builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<IPersonController, PersonController>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserController, UserController>();

builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IUserRoleController, UserRoleController>();

builder.Services.AddScoped<ICountryRepository, CountryRepository>();
builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<ICountryController, CountryController>();

builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IDepartmentController, DepartmentController>();

builder.Services.AddScoped<ICityRepository, CityRepository>();
builder.Services.AddScoped<ICityService, CityService>();
builder.Services.AddScoped<ICityController, CityController>();

builder.Services.AddScoped<IFarmRepository, FarmRepository>();
builder.Services.AddScoped<IFarmService, FarmService>();
builder.Services.AddScoped<IFarmController, FarmController>();


builder.Services.AddScoped<IBenefitRepository, BenefitRepository>();
builder.Services.AddScoped<IBenefitService, BenefitService>();
builder.Services.AddScoped<IBenefitController, BenefitController>();

builder.Services.AddScoped<ICollectionDetailRepository, CollectionDetailRepository>();
builder.Services.AddScoped<ICollectionDetailService, CollectionDetailService>();
builder.Services.AddScoped<ICollectionDetailController, CollectionDetailController>();

builder.Services.AddScoped<IHarvestRepository, HarvestRepository>();
builder.Services.AddScoped<IHarvestService, HarvestService>();
builder.Services.AddScoped<IHarvestController, HarvestController>();

builder.Services.AddScoped<ILiquidationRepository, LiquidationRepository>();
builder.Services.AddScoped<ILiquidationService, LiquidationService>();

builder.Services.AddScoped<ILotRepository, LotRepository>();
builder.Services.AddScoped<ILotService, LotService>();
builder.Services.AddScoped<ILotController, LotController>();

builder.Services.AddScoped<IPersonBenefitRepository, PersonBenefitRepository>();
builder.Services.AddScoped<IPersonBenefitService, PersonBenefitService>();
builder.Services.AddScoped<IPersonBenefitController, PersonBenefitController>();

builder.Services.AddScoped<ICollectorFarmRepository, CollectorFarmRepository>();
builder.Services.AddScoped<ICollectorFarmService, CollectorFarmService>();
builder.Services.AddScoped<ICollectorFarmController, CollectorFarmController>();

builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEmailController, EmailController>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowSpecificOrigin");

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
