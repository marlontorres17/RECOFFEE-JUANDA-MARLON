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
    private collectorApiUrl = 'http://localhost:9191/api/PersonBenefit/farm';

    userRole: string = '';
    showButtons: boolean = true;

    @ViewChild('personBenefitModal') personBenefitModal!: TemplateRef<any>;

    constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

    ngOnInit(): void {

        this.userRole = localStorage.getItem('userRole') || '';
        this.getPersonBenefits();
        this.getBenefits();
        const farmId = localStorage.getItem('farmId');
        if (farmId) {
            this.getFarmPersons(+farmId); // Convierte a número
        }
     this.checkButtonVisibility();

    }

    

    getFarmPersons(farmId: number): void {
        this.http.get<any[]>(`${this.collectorApiUrl}/${farmId}`).subscribe(
            (response) => {
                // Mapea el array para obtener solo la propiedad 'person' de cada objeto
                this.persons = response.map(item => item.person);
                console.log('Mapped persons:', this.persons); // Para verificar el resultado
                this.cdr.detectChanges();
            },
            (error) => {
                console.error('Error fetching farm persons:', error);
            }
        );
    }
    

    checkButtonVisibility(): void {
        const isLogged = localStorage.getItem('isLogged') === 'true';
        const isJoinedToFarm = localStorage.getItem('isJoinedToFarm') === 'true';

        // Oculta los botones si el usuario no está logueado o no está unido a la finca
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
                this.persons = persons;
                this.cdr.detectChanges();
            },
            (error) => {
                console.error('Error fetching persons:', error);
            }
        );
    }

    onSubmit(form: NgForm): void {
        console.log('Submitting personBenefit:', this.personBenefit);

        if (!this.isFormValid()){
            return;
        }

        if (this.personBenefit.amount < 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se permite ingresar valores negativos para la cantidad.',
            });
            return; // Salir de la función si el valor es negativo
          }
          const localDate = new Date(this.personBenefit.date);
          const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
      
          const personBenefitDto = { ...this.personBenefit, date: utcDate.toISOString().split('T')[0] };

        if (this.personBenefit.id === 0) {
            this.http.post(this.personBenefitApiUrl, personBenefitDto).subscribe(() => {
                this.getPersonBenefits();
                form.resetForm();
                this.resetForm();
                Swal.fire('Éxito', 'Beneficio de la persona creado exitosamente', 'success');
            });
        } else {
            this.http.put(`${this.personBenefitApiUrl}/${this.personBenefit.id}`, personBenefitDto).subscribe(() => {
                this.getPersonBenefits();
                form.resetForm();
                this.resetForm();
                Swal.fire('Éxito', 'Beneficio de la persona actualizado exitosamente', 'success');
            });
        }
    }

    onCollectorChange(event: any) {
        const selectedCollectorId = event.target.value;
        // Aquí puedes realizar acciones adicionales al cambiar el recolector seleccionado
        console.log('Collector selected:', selectedCollectorId);
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
            title: 'Estás seguro??',
            text: 'Estás a punto de eliminar este Beneficio de la persona. ¡Esta acción no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#9c3ce6',
            cancelButtonColor: '#1a0028',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.http.delete(`${this.personBenefitApiUrl}/${id}`).subscribe(() => {
                    this.getPersonBenefits();
                    Swal.fire('Eliminado!', 'Beneficio de la persona eliminado.', 'success');
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
        return person ? `${person.firstName} ${person.secondName} ${person.firstLastName} ${person.secondLastName}` : 'N/A';
    }

    updatePrice(): void {
        const selectedBenefit = this.benefits.find(b => b.id === this.personBenefit.benefitId);
        if (selectedBenefit) {
            this.personBenefit.price = selectedBenefit.price * this.personBenefit.amount;
        } else {
            this.personBenefit.price = 0;
        }
    }

    areAllFieldsFilled(): boolean {
        return (
            this.personBenefit.price >= 0 && // Asegúrate de que price sea un número
            this.personBenefit.amount >= 0 && // Asegúrate de que amount sea un número
            this.personBenefit.personId != null && // Verifica que no sea null o undefined
            this.personBenefit.personId > 0 &&
            this.personBenefit.benefitId != null && // Verifica que no sea null o undefined
            this.personBenefit.benefitId > 0
        );
    }
    
      isFormValid(): boolean {
    
        if (!this.areAllFieldsFilled()) {
          Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
          return false;
        }
    
        return true;
      }

      

      
}
