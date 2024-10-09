import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-person-benefit',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        NgbModule
    ],
    templateUrl: './person-benefit.component.html',
    styleUrls: ['./person-benefit.component.css']
})
export class PersonBenefitComponent implements OnInit {
    personBenefits: any[] = [];
    benefits: any[] = [];
    persons: any[] = [];
    personBenefit: any = { id: 0, state: true, date: new Date().toISOString().split('T')[0], price: 0, amount: 0, personId: 0, benefitId: 0 };
    closeResult = '';
    private personBenefitApiUrl = 'http://localhost:9191/api/PersonBenefit';
    private benefitApiUrl = 'http://localhost:9191/api/Benefit';
    private personApiUrl = 'http://localhost:9191/api/Person';

    @ViewChild('personBenefitModal') personBenefitModal!: TemplateRef<any>;

    constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

    ngOnInit(): void {
        this.getPersonBenefits();
        this.getBenefits();
        this.getPersons();
    }

    getPersonBenefits(): void {
        this.http.get<any[]>(this.personBenefitApiUrl).subscribe(
            (personBenefits) => {
                this.personBenefits = personBenefits;
                this.cdr.detectChanges();
            },
            (error) => {
                console.error('Error fetching person benefits:', error);
            }
        );
    }

    getBenefits(): void {
        this.http.get<any[]>(this.benefitApiUrl).subscribe(
            (benefits) => {
                this.benefits = benefits;
                this.cdr.detectChanges();
            },
            (error) => {
                console.error('Error fetching benefits:', error);
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
        const personBenefitDto = { ...this.personBenefit };

        if (this.personBenefit.id === 0) {
            this.http.post(this.personBenefitApiUrl, personBenefitDto).subscribe(() => {
                this.getPersonBenefits();
                form.resetForm();
                this.resetForm();
                Swal.fire('Success', 'Person Benefit created successfully', 'success');
            });
        } else {
            this.http.put(`${this.personBenefitApiUrl}/${this.personBenefit.id}`, personBenefitDto).subscribe(() => {
                this.getPersonBenefits();
                form.resetForm();
                this.resetForm();
                Swal.fire('Success', 'Person Benefit updated successfully', 'success');
            });
        }
    }

    openModal(personBenefit: any = { id: 0, state: true, date: new Date().toISOString().split('T')[0], price: 0, amount: 0, personId: 0, benefitId: 0 }): void {
        this.personBenefit = { ...personBenefit };
        this.modalService.open(this.personBenefitModal).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    editPersonBenefit(personBenefit: any): void {
        this.openModal(personBenefit);
    }

    deletePersonBenefit(id: number): void {
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
                this.http.delete(`${this.personBenefitApiUrl}/${id}`).subscribe(() => {
                    this.getPersonBenefits();
                    Swal.fire('Deleted!', 'Person Benefit has been deleted.', 'success');
                });
            }
        });
    }

    private resetForm(): void {
        this.personBenefit = { id: 0, state: true, date: new Date().toISOString().split('T')[0], price: 0, amount: 0, personId: 0, benefitId: 0 };
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

    getBenefitName(benefitId: number): string {
        const benefit = this.benefits.find(b => b.id === benefitId);
        return benefit ? benefit.name : 'N/A';
    }

    getPersonName(personId: number): string {
        const person = this.persons.find(p => p.id === personId);
        return person ? `${person.firstName} ${person.secondLastName}` : 'N/A';
    }

    updatePrice(): void {
        const selectedBenefit = this.benefits.find(b => b.id === this.personBenefit.benefitId);
        if (selectedBenefit) {
            this.personBenefit.price = selectedBenefit.price * this.personBenefit.amount;
        } else {
            this.personBenefit.price = 0;
        }
    }
}
