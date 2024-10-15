import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './lot.component.html',
  styleUrls: ['./lot.component.css']
})
export class LotComponent implements OnInit {
  lots: any[] = [];
  lot: any = {
    id: 0,
    state: true,
    name: '',
    description: '',
    sizeMeters: '',
    farmId: 0
  };
  farms: any[] = [];
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/Lot';
  private farmApiUrl = 'http://localhost:9191/api/Farm';

  @ViewChild('lotModal') lotModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    
    this.getFarms();
    this.loadLotsByFarm();
  }

  getLots(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (lots) => {
        this.lots = lots;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching lots:', error);
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

  getFarmName(farmId: number): string {
    const farm = this.farms.find(f => f.id === farmId);
    return farm ? farm.name : 'N/A';
  }

  onSubmit(form: NgForm): void {
    if (this.lot.sizeMeters < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se permite ingresar valores negativos para el tamaño.',
      });
      return; // Salir de la función si el valor es negativo
    }
    const lotDto = { ...this.lot };

    // Validación del tamaño
    if (lotDto.sizeMeters < 0 || lotDto.sizeMeters > 200) {
        Swal.fire('Error', 'El tamaño debe estar entre 0 y 200 hectáreas.', 'error');
        return;
    }

    if (this.lot.id === 0) {
        this.http.post(this.apiUrl, lotDto).subscribe(() => {
            this.getLots();
            form.resetForm();
            this.resetForm();
            Swal.fire('Éxito', 'Lote creado con éxito', 'success');
        });
    } else {
        this.http.put(`${this.apiUrl}/${this.lot.id}`, lotDto).subscribe(() => {
            this.getLots();
            form.resetForm();
            this.resetForm();
            Swal.fire('Éxito', 'Lote actualizado con éxito', 'success');
        });
    }
}




  openModal(lot: any = { id: 0, state: true, name: '', description: '', sizeMeters: '', farmId: 0 }): void {
    this.lot = { ...lot };
    this.modalService.open(this.lotModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editLot(lot: any): void {
    this.openModal(lot);
  }

  deleteLot(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar este lote. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getLots();
          Swal.fire('Eliminado!', 'Lote eliminado.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.lot = { id: 0, state: true, name: '', description: '', sizeMeters: '', farmId: 0 };
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

  loadLotsByFarm(): void {
    const farmId = localStorage.getItem('farmId'); // Obtener el farmId del localStorage
    if (farmId) {
      this.http.get<any[]>(`${this.apiUrl}/farm/${farmId}`).subscribe(
        (response) => {
          this.lots = response; // Asigna el array a la propiedad 'lots'
          this.cdr.detectChanges(); // Detecta cambios en la vista
        },
        (error) => {
          console.error('Error fetching lots by farm:', error);
        }
      );
    } else {
      console.warn('No farmId found in localStorage.');
    }
  }
}
