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
    this.getLots();
    this.getFarms();
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
    const lotDto = { ...this.lot };

    if (this.lot.id === 0) {
      this.http.post(this.apiUrl, lotDto).subscribe(() => {
        this.getLots();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Lot created successfully', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.lot.id}`, lotDto).subscribe(() => {
        this.getLots();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Lot updated successfully', 'success');
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
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getLots();
          Swal.fire('Deleted!', 'Lot has been deleted.', 'success');
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
}
