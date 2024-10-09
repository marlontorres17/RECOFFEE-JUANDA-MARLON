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
    this.getHarvests();
    this.getLots();
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

  getLots(): void {
    this.http.get<any[]>(this.lotApiUrl).subscribe(
      (lots) => {
        this.lots = lots;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching lots:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    const harvestDto = { ...this.harvest };

    if (this.harvest.id === 0) {
      this.http.post(this.harvestApiUrl, harvestDto).subscribe(() => {
        this.getHarvests();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Harvest created successfully', 'success');
      });
    } else {
      this.http.put(`${this.harvestApiUrl}/${this.harvest.id}`, harvestDto).subscribe(() => {
        this.getHarvests();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Harvest updated successfully', 'success');
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
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.harvestApiUrl}/${id}`).subscribe(() => {
          this.getHarvests();
          Swal.fire('Deleted!', 'Harvest has been deleted.', 'success');
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
}
