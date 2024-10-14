import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-crear-finca',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './crear-finca.component.html',
  styleUrls: ['./crear-finca.component.css']
})
export class CrearFincaComponent implements OnInit {
  farms: any[] = [];
  farm: any = {
    id: 0,
    state: true,
    name: '',
    description: '',
    sizeMeter: 0,
    coordinate: '',
    codeUnique: '',
    personId: 0,
    cityId: 0
  };
  lot: any = {
    id: 0,
    state: true,
    name: '',
    description: '',
    sizeMeters: 0,
    farmId: 0
  };
  departments: any[] = [];
  persons: any[] = [];
  cities: any[] = [];
  farmId: number = 0;
  private apiUrl = 'http://localhost:9191/api/Farm';
  private personApiUrl = 'http://localhost:9191/api/Person';
  private cityApiUrl = 'http://localhost:9191/api/City';
  private lotApiUrl = 'http://localhost:9191/api/Lot';
  private DepartmentUrl = 'http://localhost:9191/api/Department';

  @ViewChild('farmModal') farmModal!: TemplateRef<any>;
  @ViewChild('lotModal') lotModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal, private router: Router) {}
  

  ngOnInit(): void {

    const personId = localStorage.getItem('personId');
    if (personId) {
        this.farm.personId = +personId;
        console.log('Person ID:', this.farm.personId); // Verifica que se establece correctamente
    }

    this.loadFarmsForCurrentPerson();
    this.getPersons();
    this.getCities();
    this.getDepartments();

  }

  selectFarm(farmId: number): void {
    localStorage.setItem('farmId', farmId.toString());
    Swal.fire('Éxito', `Finca ${farmId} seleccionada y guardada en localStorage.`, 'success');
  }

  getFarms(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (farms) => {
        console.log(farms);
        this.farms = farms;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching farms:', error);
      }
    );
  }


  validateSize(): void {
    if (this.lot.sizeMeters < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se permite ingresar valores negativos para el tamaño.',
      });
      // Resetea el valor si es negativo
      this.lot.sizeMeters = 0;
    }
  }

  validateSizeD(): void {
    if (this.farm.sizeMeter < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se permite ingresar valores negativos para el tamaño.',
      });
      // Resetea el valor si es negativo
      this.farm.sizeMeter = 0;
    }
  }

    getPersons(): void {
      this.http.get<any[]>('http://localhost:9191/api/Person/admins').subscribe(
        
        (persons) => {
          this.persons = persons;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching persons with admin role:', error);
        }
      );
    }
  

  /*getPersons(): void {
    this.http.get<any[]>(this.personApiUrl).subscribe(
      (persons) => {
        this.persons = persons;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching persons:', error);
      }
    );
  }
*/
  viewLots(farmId: number): void {
    this.router.navigate(['/seguridad/lotes', farmId]);
  }

  getCities(): void {
    this.http.get<any[]>(this.cityApiUrl).subscribe(
      (cities) => {
        this.cities = cities;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  getDepartments(): void {
    this.http.get<any[]>(this.DepartmentUrl).subscribe(departments => {
      this.departments = departments;
      this.cdr.detectChanges();
    }, error => {
      console.error('Error fetching departments:', error);
    });
  }

  getPersonName(personId: number): string {
    const person = this.persons.find(p => p.id === personId);
    if (person) {
      return `${person.firstName} ${person.secondName} ${person.firstLastName} ${person.secondLastName}`.trim();
  }
  return 'N/A'; // Retorna 'N/A' si no se encuentra la persona
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.id === cityId);
  const department = this.departments.find(d => d.id === (city ? city.departmentId : 0));
  
  return city && department ? `${city.name} - ${department.name}` : 'N/A';
  }

  getDepartmentName(departmentId: number): string{
    const department = this.departments.find(d => d.id === departmentId);
    return department ? department.name : 'N/A';
  }

  onSubmit(form: NgForm): void {
    if (!this.isFormValid()) {
      return;
  }
    if (this.farm.sizeMeter < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se permite ingresar valores negativos para el tamaño.',
      });
      return; // Salir de la función si el valor es negativo
    }

    // Verificar cuántas fincas hay actualmente
    if (this.farms.length >= 5) {
        Swal.fire('Límite alcanzado', 'No puedes crear más de 5 fincas', 'warning');
        return; // Salir de la función si se alcanza el límite
    }

    const farmDto = { ...this.farm };
  const personId = localStorage.getItem('personId');

  if (personId) {
    farmDto.personId = +personId; // Establecer el personId en el DTO de la finca
  }

  // Verificar si es una nueva finca o una actualización
  if (this.farm.id === 0) {
    // Crear una nueva finca
    this.http.post(this.apiUrl, farmDto).subscribe(
      () => {
        this.loadFarmsForCurrentPerson(); // Recargar las fincas después de crear
        form.resetForm(); // Resetear el formulario
        this.resetForm(); // Opcional: Resetear el modelo de la finca
        Swal.fire('Éxito', 'Finca creada exitosamente', 'success');
      },
      (error) => {
        console.error('Error al agregar la finca:', error);
      }
    );
  } else {
    // Actualizar una finca existente
    this.http.put(`${this.apiUrl}/${this.farm.id}`, farmDto).subscribe(
      () => {
        this.loadFarmsForCurrentPerson(); // Recargar las fincas después de modificar
        form.resetForm(); // Resetear el formulario
        this.resetForm(); // Opcional: Resetear el modelo de la finca
        Swal.fire('Éxito', 'Finca actualizada exitosamente', 'success');
      },
      (error) => {
        console.error('Error al actualizar la finca:', error);
      }
    );
  }
  
  this.modalService.dismissAll(); // Cerrar el modal si se estaba usando
}

private resetForm(): void {
  this.farm = { id: 0, state: true, name: '', description: '', sizeMeter: 0, coordinate: '', codeUnique: '', personId: this.farm.personId, cityId: 0 };
}

  onSubmitLot(form: NgForm): void {

    if (!this.isFormValidLot()) {
        return;
    }

    if (this.lot.sizeMeters < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se permite ingresar valores negativos para el tamaño.',
      });
      return; // Salir de la función si el valor es negativo
    }
    const lotDto = { ...this.lot };

    if (this.lot.id === 0) {
      this.http.post(this.lotApiUrl, lotDto).subscribe(
      
        (response) => {
          this.getFarms();
          
          Swal.fire('Éxito', 'Lote agregado correctamente', 'success');
        },
        (error) => {
          console.error('Error adding lot:', error);
        }
      );
    } else {
      this.http.put(`${this.lotApiUrl}/${this.lot.id}`, lotDto).subscribe(
        (response) => {
          this.getFarms();
          Swal.fire('Éxito', 'Lote actualizado correctamente', 'success');
        },
        (error) => {
          console.error('Error updating lot:', error);
        }
      );
    }

    form.reset();
    this.modalService.dismissAll();
  }

  editFarm(farm: any): void {
    this.farm = { ...farm };
    this.modalService.open(this.farmModal);
  }

  deleteFarm(farmId: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar esta finca. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${farmId}`).subscribe(
          () => {
            this.getFarms();
            Swal.fire('Eliminado!', 'La finca ha sido eliminada.', 'success');
          },
          (error) => {
            console.error('Error deleting farm:', error);
          }
        );
      }
    });
  }

  openFarmModal(): void {
    const personId = localStorage.getItem('personId');
    this.farm = { id: 0, state: true, name: '', description: '', sizeMeter: "", coordinate: '', personId: personId, cityId: 0 };
    this.modalService.open(this.farmModal);
  }

  openLotModal(farmId: number): void {
    this.lot = { id: 0, state: true, name: '', description: '', sizeMeters: "", farmId: farmId };
    this.modalService.open(this.lotModal);
  }
  areAllFieldsFilled(): boolean {
    return (
      this.farm.name.trim() !== '' &&
      this.farm.description.trim() !== '' &&
      this.farm.coordinate.trim() !== '' &&
      this.farm.personId != null && // Verifica que no sea null o undefined
      this.farm.personId > 0 &&
      this.farm.cityId != null && // Verifica que no sea null o undefined
      this.farm.cityId > 0 &&
      this.farm.sizeMeter > 0 // Asegúrate de que sea mayor que cero
    );
  }
  

  isFormValid(): boolean {

    if (!this.areAllFieldsFilled()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }

    return true;
  }

  areAllFieldsFilledLot(): boolean {
    return (
      this.lot.name.trim() !== '' &&
      this.lot.description.trim() !== '' &&
      this.lot.farmId != null && // Verifica que no sea null o undefined
      this.lot.farmId > 0 &&
      this.lot.sizeMeters > 0
    );
  }

  isFormValidLot(): boolean {

    if (!this.areAllFieldsFilledLot()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }

    return true;
  }

  loadFarmsForCurrentPerson(): void {
    const personId = localStorage.getItem('personId'); // Obtener el personId del localStorage
    if (personId) {
      this.http.get<any[]>(`${this.apiUrl}/person/farm/${personId}`).subscribe(
        (response) => {
          // Aquí verificamos si la respuesta es un array o un objeto
          if (Array.isArray(response)) {
            this.farms = response; // Si es un array, asignamos directamente
          } else {
            this.farms = [response]; // Si es un objeto, lo convertimos en un array
          }
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching farms:', error);
        }
      );
    } else {
      console.warn('No personId found in localStorage.');
    }
}
}
