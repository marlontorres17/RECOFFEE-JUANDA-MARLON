using Entity.Model.Operational;
using Entity.Model.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace YourNamespace.Configurations
{
    public class GenericConfig<TEntity> : IEntityTypeConfiguration<TEntity> where TEntity : class
    {
        public virtual void Configure(EntityTypeBuilder<TEntity> builder)
        {
            // Aquí puedes definir configuraciones genéricas si las necesitas
        }
    }

    // Clase específica para configurar la entidad Farm
    public class FarmConfig : GenericConfig<Farm>
    {
        public override void Configure(EntityTypeBuilder<Farm> builder)
        {
            base.Configure(builder);

            // Configuración de unicidad para codeUnique
            builder.HasIndex(f => f.codeUnique).IsUnique();

            // Otras configuraciones específicas de Farm si las hay
        }
    }

    public class PersonConfig : GenericConfig<Person>
    {
        public override void Configure(EntityTypeBuilder<Person> builder)
        {
            base.Configure(builder);
            builder.HasIndex(p => p.NumberDocument).IsUnique();
            builder.HasIndex(p => p.Email).IsUnique();
        }
    }

    public class UserConfig : GenericConfig<User>
    {
        public override void Configure(EntityTypeBuilder<User> builder)
        {
            base.Configure(builder);

            // Definir el índice único para UserName y establecer longitud máxima
            builder.Property(u => u.UserName)
                .IsRequired() // Indica que el campo es obligatorio
                .HasMaxLength(20); // Limita la longitud del UserName a 20 caracteres

            builder.HasIndex(u => u.UserName).IsUnique();
        }
    }

}