using Dapper;
using Entity.Model.Operational;
using Entity.Model.Parameter;
using Entity.Model.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Entity.Model.Context
{
    public class ApplicationDbContext : DbContext
    {
        protected readonly IConfiguration _configuration;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración para evitar ciclos o múltiples cascadas en la relación Farm-Person
            modelBuilder.Entity<Farm>()
                .HasOne(f => f.Person)
                .WithMany()  // Si hay una relación inversa, especifícala aquí
                .HasForeignKey(f => f.PersonId)
                .OnDelete(DeleteBehavior.NoAction); // Evitar cascada al eliminar

            // Configuración para la relación Farm-City
            modelBuilder.Entity<Farm>()
                .HasOne(f => f.City)
                .WithMany()
                .HasForeignKey(f => f.CityId)
                .OnDelete(DeleteBehavior.NoAction); // Evitar cascada al eliminar

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<decimal>().HavePrecision(18, 2);
        }

        public override int SaveChanges()
        {
            EnsureAudit();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            EnsureAudit();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void EnsureAudit()
        {
            ChangeTracker.DetectChanges();

            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.OnCreate(); // Establece la fecha de creación
                        break;
                    case EntityState.Modified:
                        entry.Entity.OnUpdate(); // Actualiza la fecha de modificación
                        break;
                }
            }
        }

        // Dapper EF Core Command
        public readonly struct DapperEFCoreCommand : IDisposable
        {
            public DapperEFCoreCommand(DbContext context, string text, object parameters, int? timeout, CommandType? type, CancellationToken ct)
            {
                var transaction = context.Database.CurrentTransaction?.GetDbTransaction();
                var commandType = type ?? CommandType.Text;
                var commandTimeout = timeout ?? context.Database.GetCommandTimeout() ?? 30;

                Definition = new CommandDefinition(
                    text,
                    parameters,
                    transaction,
                    commandTimeout,
                    commandType,
                    cancellationToken: ct);
            }

            public CommandDefinition Definition { get; }

            public void Dispose()
            {
            }
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string text, object parameters = null, int? timeout = null, CommandType? type = null)
        {
            using var command = new DapperEFCoreCommand(this, text, parameters, timeout, type, CancellationToken.None);
            var connection = this.Database.GetDbConnection();
            return await connection.QueryAsync<T>(command.Definition);
        }

        public async Task<T> QueryFirstOrDefaultAsync<T>(string text, object parameters = null, int? timeout = null, CommandType? type = null)
        {
            using var command = new DapperEFCoreCommand(this, text, parameters, timeout, type, CancellationToken.None);
            var connection = this.Database.GetDbConnection();
            return await connection.QueryFirstOrDefaultAsync<T>(command.Definition);
        }

        // DbSets para las entidades
        public DbSet<Role> roles => Set<Role>();

        public DbSet<Email> emails => Set<Email>();
        public DbSet<View> views => Set<View>();
        public DbSet<Security.Module> modules => Set<Security.Module>();
        public DbSet<RoleView> roleViews => Set<RoleView>();
        public DbSet<Person> persons => Set<Person>();
        public DbSet<User> users => Set<User>();
        public DbSet<UserRole> userRoles => Set<UserRole>();
        public DbSet<Country> countries => Set<Country>();
        public DbSet<Department> departments => Set<Department>();
        public DbSet<City> cities => Set<City>();
        public DbSet<Farm> farms => Set<Farm>();
        public DbSet<Benefit> benefits => Set<Benefit>();
        public DbSet<Lot> lots => Set<Lot>();
        public DbSet<Harvest> harvests => Set<Harvest>();
        public DbSet<PersonBenefit> personBenefits => Set<PersonBenefit>();
        public DbSet<CollectionDetail> collectionDetails => Set<CollectionDetail>();
        public DbSet<Liquidation> liquidations => Set<Liquidation>();
        public DbSet<CollectorFarm> collectorFarms => Set<CollectorFarm>();
    }
}