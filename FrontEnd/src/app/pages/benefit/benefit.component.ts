import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-benefit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './benefit.component.html',
  styleUrls: ['./benefit.component.css']
})
export class BenefitComponent implements OnInit {
  benefits: any[] = [];
  farms: any[] = [];
  benefit: any = { id: 0, state: true, name: '', description: '', cost: '', farmId: 0 };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/Benefit';
  private farmApiUrl = 'http://localhost:9191/api/Farm';

  @ViewChild('benefitModal') benefitModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getBenefits();
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
    const benefitDto = { ...this.benefit };

    if (this.benefit.id === 0) {
      this.http.post(this.apiUrl, benefitDto).subscribe(() => {
        this.getBenefits();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Benefit created successfully', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.benefit.id}`, benefitDto).subscribe(() => {
        this.getBenefits();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Benefit updated successfully', 'success');
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
          this.getBenefits();
          Swal.fire('Deleted!', 'Benefit has been deleted.', 'success');
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
}
