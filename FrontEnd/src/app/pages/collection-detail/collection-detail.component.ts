import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {
  collectionDetails: any[] = [];
  persons: any[] = [];
  harvests: any[] = [];
  collectionDetail: any = { id: 0, state: true, kilo: '', stage: '', personId: 0, harvestId: 0 };
  closeResult = '';
  private collectionDetailApiUrl = 'http://localhost:9191/api/CollectionDetail';
  private personApiUrl = 'http://localhost:9191/api/Person';
  private harvestApiUrl = 'http://localhost:9191/api/Harvest';

  @ViewChild('collectionDetailModal') collectionDetailModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getCollectionDetails();
    this.getPersons();
    this.getHarvests();
  }

  getCollectionDetails(): void {
    this.http.get<any[]>(this.collectionDetailApiUrl).subscribe(
      (collectionDetails) => {
        this.collectionDetails = collectionDetails;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching collection details:', error);
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

  onSubmit(form: NgForm): void {
    const collectionDetailDto = { ...this.collectionDetail };

    if (this.collectionDetail.id === 0) {
      this.http.post(this.collectionDetailApiUrl, collectionDetailDto).subscribe(() => {
        this.getCollectionDetails();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxito', 'Detalle de la recolección creado exitosamente', 'success');
      });
    } else {
      this.http.put(`${this.collectionDetailApiUrl}/${this.collectionDetail.id}`, collectionDetailDto).subscribe(() => {
        this.getCollectionDetails();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxito', 'Detalle de la recolección actualizado exitosamente', 'success');
      });
    }
  }

  openModal(collectionDetail: any = { id: 0, state: true, kilo: '', stage: '', personId: 0, harvestId: 0 }): void {
    this.collectionDetail = { ...collectionDetail };
    this.modalService.open(this.collectionDetailModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editCollectionDetail(collectionDetail: any): void {
    this.openModal(collectionDetail);
  }

  deleteCollectionDetail(id: number): void {
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
        this.http.delete(`${this.collectionDetailApiUrl}/${id}`).subscribe(() => {
          this.getCollectionDetails();
          Swal.fire('Eliminado!', 'Detalle de la recolección eliminado.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.collectionDetail = { id: 0, state: true, kilo: '', stage: '', personId: 0, harvestId: 0 };
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
    return person ? `${person.firstName} ${person.secondLastName}` : 'N/A';
  }

  getHarvestStage(harvestId: number): string {
    const harvest = this.harvests.find(h => h.id === harvestId);
    return harvest ? harvest.date : 'N/A';
  }
}
