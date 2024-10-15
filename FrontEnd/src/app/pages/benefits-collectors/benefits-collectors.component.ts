import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-benefits-collectors',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule],
  templateUrl: './benefits-collectors.component.html',
  styleUrl: './benefits-collectors.component.css'
})
export class BenefitsCollectorsComponent implements OnInit {
  benefits: any[] = [];
  farms: any[] = [];
  benefit: any = { id: 0, state: true, name: '', description: '', cost: '', farmId: 0 };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/Benefit';
  private farmApiUrl = 'http://localhost:9191/api/Farm';

  @ViewChild('benefitModal') benefitModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadBenefitsByFarm();
    this.getFarms();
  }

  getBenefits(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (benefits) => {
        this.benefits = benefits;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching benefits:', error);
      }
    );
  }

  getFarms(): void {
    this.http.get<any[]>(this.farmApiUrl).subscribe(
      (farms) => {
        this.farms = farms;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching farms:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
if(!this.isFormValid()){
  return;
}

    if (isNaN(Number(this.benefit.cost)) || Number(this.benefit.cost) < 0) {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El costo debe ser un número positivo.',
      });
      return; // Salir de la función si el valor no es válido
  }

  const benefitDto = { 
      ...this.benefit,
      cost: String(this.benefit.cost) // Asegúrate de enviar 'cost' como una cadena
  };


    if (this.benefit.id === 0) {
      this.http.post(this.apiUrl, benefitDto).subscribe(() => {
        this.getBenefits();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxiito', 'Beneficiio creado exitosamente', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.benefit.id}`, benefitDto).subscribe(() => {
        this.getBenefits();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxiito', 'Beneficiio actualizado exitosamente', 'success');
      });
    }
  }

  openModal(benefit: any = { id: 0, state: true, name: '', description: '', cost: '', farmId: 0 }): void {
    this.benefit = { ...benefit };
    this.modalService.open(this.benefitModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editBenefit(benefit: any): void {
    this.openModal(benefit);
  }

  deleteBenefit(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar este beneficio. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getBenefits();
          Swal.fire('Eliminado!', 'Beneficio eliminado.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.benefit = { id: 0, state: true, name: '', description: '', cost: '', farmId: 0 };
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getFarmName(farmId: number): string {
    const farm = this.farms.find(f => f.id === farmId);
    return farm ? farm.name : 'N/A';
  }

  areAllFieldsFilled(): boolean {
    return (
        this.benefit.cost >= 0 && 
        this.benefit.farmId != null && 
        this.benefit.farmId > 0 &&
        this.benefit.name.trim() !== '' &&
      this.benefit.description.trim() !== '' 
    );
}

  isFormValid(): boolean {

    if (!this.areAllFieldsFilled()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }

    return true;
  }

  loadBenefitsByFarm(): void {
    const farmId = localStorage.getItem('farmId'); // Obtener el farmId del localStorage
    if (farmId) {
      this.http.get<any[]>(`${this.apiUrl}/farm/${farmId}`).subscribe(
        (response) => {
          // Verifica si la respuesta es un array y lo asigna correctamente a la lista de beneficios
          if (Array.isArray(response)) {
            this.benefits = response; // Asigna el array a la propiedad 'benefits'
          } else {
            this.benefits = [response]; // Convierte un objeto en un array si es necesario
          }
          this.cdr.detectChanges(); // Detecta cambios en la vista
        },
        (error) => {
          console.error('Error fetching farm benefits:', error);
        }
      );
    } else {
      console.warn('No farmId found in localStorage.');
    }
}




}
