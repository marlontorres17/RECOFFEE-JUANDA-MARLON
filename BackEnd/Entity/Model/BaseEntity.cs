using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public bool State { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Método para establecer la fecha de creación (solo la primera vez)
        public void SetCreationDate()
        {
            if (CreatedAt == null) // Solo se asigna una vez al crear el registro
            {
                CreatedAt = DateTime.UtcNow;
            }
        }

        // Método para actualizar la fecha de modificación
        public void SetUpdatedDate()
        {
            UpdatedAt = DateTime.UtcNow; // Se actualiza cada vez que el registro se modifique
        }

        // Método para establecer la fecha de eliminación lógica
        

        // Método que se llama cuando se crea un nuevo registro (puedes llamarlo en el constructor si prefieres)
        public void OnCreate()
        {
            SetCreationDate(); // Establece la fecha de creación
            UpdatedAt = null;  // Asegura que UpdatedAt esté vacío inicialmente
            
        }

        // Método que se llama cuando el registro se actualiza
        public void OnUpdate()
        {
            SetUpdatedDate(); // Actualiza la fecha de modificación
        }

        // Método que se llama cuando el registro se elimina lógicamente
        
    }


}

