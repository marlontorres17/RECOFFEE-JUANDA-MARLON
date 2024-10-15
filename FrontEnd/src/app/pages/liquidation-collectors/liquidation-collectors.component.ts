import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liquidation-collectors',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule],
  templateUrl: './liquidation-collectors.component.html',
  styleUrl: './liquidation-collectors.component.css'
})
export class LiquidationCollectorsComponent implements OnInit {
  
  liquidations: any[] = [];
  persons: any[] = [];
  liquidation: any = { id: 0, state: true, totalKilo: '', totalBenefit: '', totalPay: '', farmID: 0, personId: 0 };
  closeResult = '';
  private farmUrl = 'http://localhost:9191/api/Farm';
  private apiUrl = 'http://localhost:9191/api/Liquidation';
  private personApiUrl = 'http://localhost:9191/api/Person';
  private collectorApiUrl = 'http://localhost:9191/api/PersonBenefit/farm';

  @ViewChild('liquidationModal') liquidationModal!: TemplateRef<any>;

  userRole: string = '';
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.loadFarmId();
    this.loadLiquidationsByFarm();
    this.getCollectorsByFarm();
    const personId = localStorage.getItem('personId');
    if (personId) {
        this.getLiquidationsByPersonId(+personId);
    } else {
        // Si no hay personId, podrías establecer un estado por defecto o mostrar un mensaje
        console.warn('No personId found in local storage.');
    }
  }

  
  getLiquidationsByPersonId(personId: number): void {
    this.http.get<any[]>(`${this.apiUrl}/person/${personId}`).subscribe(
      (response) => {
        this.liquidations = response;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching person benefits:', error);
        Swal.fire('Error', 'Error fetching person benefits', 'error');
      }
    );
  }

  loadFarmId(): void {
    const farmId = localStorage.getItem('farmId');
    if (!farmId) {
      this.http.get<any[]>(this.farmUrl).subscribe((farms) => {
        if (farms && farms.length > 0) {
          const selectedFarmId = farms[0].id; // Asumimos que seleccionas la primera finca
          localStorage.setItem('farmId', selectedFarmId.toString()); // Guardamos farmId
        }
      });
    }
  }



  getLiquidations(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (liquidations) => {
        this.liquidations = liquidations;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching liquidations:', error);
      }
    );
  }

  getCollectorsByFarm(): void {
    const farmId = localStorage.getItem('farmId');
    if (farmId) {
      this.http.get<any[]>(`${this.collectorApiUrl}/${farmId}`).subscribe(
        (response) => {
          this.persons = response.map(item => item.person);
          console.log('Mapped persons:', this.persons);
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching farm persons:', error);
        }
      );
    }
  }


  onSubmit(form: NgForm): void {

    if (!this.isFormValid()) {
      return;
  }

    const liquidationDto = {
        ...this.liquidation,
        totalKilo: null,   // Estos valores son manejados por la lógica de backend
        totalBenefit: null,
        totalPay: null
    };
    const farmId = localStorage.getItem('farmId');

    if (farmId) {
      liquidationDto.farmId = +farmId; // Establecer el personId en el DTO de la finca
    }

    if (this.liquidation.id === 0) {
        this.http.post(this.apiUrl, liquidationDto).subscribe(() => {
            this.getLiquidations();
            form.resetForm();
            this.resetForm();
            Swal.fire('Éxito', 'Liquidación creada exitosamente', 'success');
        });
    } else {
        this.http.put(`${this.apiUrl}/${this.liquidation.id}`, liquidationDto).subscribe(() => {
            this.getLiquidations();
            form.resetForm();
            this.resetForm();
            Swal.fire('Éxito', 'Liquidación actualizada exitosamente', 'success');
        });
    }
}

  openModal(liquidation: any = { id: 0, state: true, totalKilo: '', totalBenefit: '', totalPay: '', personId: 0 }): void {
    this.liquidation = { ...liquidation };
    this.modalService.open(this.liquidationModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editLiquidation(liquidation: any): void {
    this.openModal(liquidation);
  }

  deleteLiquidation(id: number): void {
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
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getLiquidations();
          Swal.fire('Eliminada!', 'Liquidaciion eliminada.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.liquidation = { id: 0, state: true, totalKilo: '', totalBenefit: '', totalPay: '', personId: 0 };
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

  getPersonName(personId: number): string {
    const person = this.persons.find(p => p.id === personId);
    return person ? `${person.firstName} ${person.firstLastName}` : '';
  }

  areAllFieldsFilled(): boolean {
    return (
      this.liquidation.personId != null && // Verifica que no sea null o undefined
      this.liquidation.personId > 0 
    );
  }
  isFormValid(): boolean {

    if (!this.areAllFieldsFilled()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }

    return true;
  }


  loadLiquidationsByFarm(): void {
    const farmId = localStorage.getItem('farmId'); // Obtener el farmId del localStorage
    if (farmId) {
      this.http.get<any[]>(`${this.apiUrl}/farm/${farmId}`).subscribe(
        (response) => {
          // Verifica si la respuesta es un array y lo asigna correctamente a la lista de beneficios
          if (Array.isArray(response)) {
            this.liquidations = response; // Asigna el array a la propiedad 'liquidations'
          } else {
            this.liquidations = [response]; // Convierte un objeto en un array si es necesario
          }
          this.cdr.detectChanges(); // Detecta cambios en la vista
        },
        (error) => {
          console.error('Error fetching farm liquidations:', error);
        }
      );
    } else {
      console.warn('No farmId found in localStorage.');
    }
}
}