import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-benefit-person-recolector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './benefit-person-recolector.component.html',
  styleUrls: ['./benefit-person-recolector.component.css'] // Cambié 'styleUrl' a 'styleUrls'
})
export class BenefitPersonRecolectorComponent implements OnInit {
  personBenefits: any[] = [];
  benefits: any[] = [];
  persons: any[] = [];
  personBenefit: any = { id: 0, state: true, date: new Date().toISOString().split('T')[0], price: 0, amount: 0, personId: 0, benefitId: 0 };
  closeResult = '';
  
  private personBenefitApiUrl = 'http://localhost:9191/api/PersonBenefit';
  private benefitApiUrl = 'http://localhost:9191/api/Benefit';
  private personApiUrl = 'http://localhost:9191/api/Person';
  private collectorApiUrl = 'http://localhost:9191/api/PersonBenefit/farm';

  userRole: string = '';
  showButtons: boolean = true;

  @ViewChild('personBenefitModal') personBenefitModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.getBenefits();
    this.getPersons();
    
    // Primero obtén todos los beneficios y personas
    this.getPersonBenefits();

    const personId = localStorage.getItem('personId');
    if (personId) {
        this.getPersonBenefitsByPersonId(+personId);
    } else {
        // Si no hay personId, podrías establecer un estado por defecto o mostrar un mensaje
        console.warn('No personId found in local storage.');
    }

    this.checkButtonVisibility();
}


  checkButtonVisibility(): void {
    const isLogged = localStorage.getItem('isLogged') === 'true';
    const isJoinedToFarm = localStorage.getItem('isJoinedToFarm') === 'true';
    this.showButtons = isLogged && isJoinedToFarm && this.userRole === 'recolector';
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
        this.persons = persons || [];
        console.log('Persons loaded:', this.persons);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching persons:', error);
      }
    );
  }

  getBenefitName(benefitId: number): string {
    const benefit = this.benefits.find(b => b.id === benefitId);
    return benefit ? benefit.name : 'N/A';
  }

  getPersonName(personId: number): string {
    const person = this.persons.find(p => p.id === personId);
    return person ? `${person.firstName} ${person.secondName} ${person.firstLastName} ${person.secondLastName}` : 'N/A';
  }

  updatePrice(): void {
    const selectedBenefit = this.benefits.find(b => b.id === this.personBenefit.benefitId);
    this.personBenefit.price = selectedBenefit ? selectedBenefit.price * this.personBenefit.amount : 0;
  }

  isFormValid(): boolean {
    if (!this.areAllFieldsFilled()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }
    return true;
  }

  private areAllFieldsFilled(): boolean {
    return (
      this.personBenefit.price >= 0 &&
      this.personBenefit.amount >= 0 &&
      this.personBenefit.personId > 0 &&
      this.personBenefit.benefitId > 0
    );
  }

  getPersonBenefitsByPersonId(personId: number): void {
    this.http.get<any[]>(`${this.personBenefitApiUrl}/person/${personId}`).subscribe(
      (response) => {
        this.personBenefits = response;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching person benefits:', error);
        Swal.fire('Error', 'Error fetching person benefits', 'error');
      }
    );
  }
}
