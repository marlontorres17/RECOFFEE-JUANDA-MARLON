import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-harvest',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.css']
})
export class HarvestComponent implements OnInit {
  harvests: any[] = [];
  lots: any[] = [];
  harvest: any = { id: 0, state: true, date: new Date().toISOString().split('T')[0], kiloPrice: 0, lotId: 0 };
  closeResult = '';
  private harvestApiUrl = 'http://localhost:9191/api/Harvest';
  private lotApiUrl = 'http://localhost:9191/api/Lot';

  @ViewChild('harvestModal') harvestModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadHarvestByFarm();
    const farmId = localStorage.getItem('farmId');
        if (farmId) {
            this.getLots(+farmId); // Convierte a número
        }
  }

  getHarvests(): void {
    this.http.get<any[]>(this.harvestApiUrl).subscribe(
      (harvests) => {
        this.harvests = harvests;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching harvests:', error);
      }
    );
  }

  getLots(farmId: number): void {
    this.http.get<any[]>(`${this.lotApiUrl}/farm/${farmId}`).subscribe(
      (lots) => {
        this.lots = lots;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching lots:', error);
      }
    );
  }

  getFarmLots(farmId: number): void {
    this.http.get<any[]>(`${this.lotApiUrl}/farm/${farmId}`).subscribe(
        (response) => {
            // Mapea el array para obtener solo la propiedad 'Lot' de cada objeto
            this.lots = response.map(item => item.Lot);
            console.log('Mapped lots:', this.lots); // Para verificar el resultado
            this.cdr.detectChanges();
        },
        (error) => {
            console.error('Error fetching farm lots:', error);
        }
    );
}
  onSubmit(form: NgForm): void {
    if (!this.isFormValid()){
      return;
  }

  if (this.harvest.kiloPrice < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se permite ingresar valores negativos para la cantidad.',
      });
      return; // Salir de la función si el valor es negativo
    }
    const harvestDto = { ...this.harvest };

    if (this.harvest.id === 0) {
      this.http.post(this.harvestApiUrl, harvestDto).subscribe(() => {
        this.getHarvests();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxito', 'Recolección creada exitosamente', 'success');
      });
    } else {
      this.http.put(`${this.harvestApiUrl}/${this.harvest.id}`, harvestDto).subscribe(() => {
        this.getHarvests();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxito', 'Recolección actualizada successfully', 'success');
      });
    }
  }

  openModal(harvest: any = { id: 0, state: true, date: new Date().toISOString().split('T')[0], kiloPrice: 0, lotId: 0 }): void {
    this.harvest = { ...harvest };
    this.modalService.open(this.harvestModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editHarvest(harvest: any): void {
    this.openModal(harvest);
  }

  deleteHarvest(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar esta liquidación. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.harvestApiUrl}/${id}`).subscribe(() => {
          this.getHarvests();
          Swal.fire('eliminada!', 'Recolección eliminada.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.harvest = { id: 0, state: true, date: new Date().toISOString().split('T')[0], kiloPrice: 0, lotId: 0 };
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

  getLotName(lotId: number): string {
    const lot = this.lots.find(l => l.id === lotId);
    return lot ? lot.name : 'N/A';
  }

  areAllFieldsFilled(): boolean {
    const isDateValid = this.harvest.date && !isNaN(Date.parse(this.harvest.date));
    return (
        isDateValid &&
        this.harvest.kiloPrice >= 0 && 
        this.harvest.lotId != null && 
        this.harvest.lotId > 0 
    );
}

  isFormValid(): boolean {

    if (!this.areAllFieldsFilled()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }

    return true;
  }

  loadHarvestByFarm(): void {
    const farmId = localStorage.getItem('farmId'); // Obtener el farmId del localStorage
    if (farmId) {
      this.http.get<any[]>(`${this.harvestApiUrl}/farm/${farmId}`).subscribe(
        (response) => {
          // Verifica si la respuesta es un array y lo asigna correctamente a la lista de beneficios
          if (Array.isArray(response)) {
            this.harvests = response; // Asigna el array a la propiedad 'harvests'
          } else {
            this.harvests = [response]; // Convierte un objeto en un array si es necesario
          }
          this.cdr.detectChanges(); // Detecta cambios en la vista
        },
        (error) => {
          console.error('Error fetching farm harvests:', error);
        }
      );
    } else {
      console.warn('No farmId found in localStorage.');
    }
}

}

