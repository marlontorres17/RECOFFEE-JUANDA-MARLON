import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liquidation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.css']
})
export class LiquidationComponent implements OnInit {
  liquidations: any[] = [];
  persons: any[] = [];
  liquidation: any = { id: 0, state: true, totalKilo: '', totalBenefit: '', totalPay: '', personId: 0 };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/Liquidation';
  private personApiUrl = 'http://localhost:9191/api/Person';

  @ViewChild('liquidationModal') liquidationModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getLiquidations();
    this.getPersons();
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

  getPersons(): void {
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

  onSubmit(form: NgForm): void {
    const liquidationDto = {
        ...this.liquidation,
        totalKilo: null,   // Estos valores son manejados por la lógica de backend
        totalBenefit: null,
        totalPay: null
    };

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
}
