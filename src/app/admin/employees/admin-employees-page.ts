import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '@app/features/customers/application/services/employee.service';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';

@Component({
    selector: 'app-admin-employees-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-employees-page.html',
})
export class AdminEmployeesPage implements OnInit {
    private employeeService = inject(EmployeeService);
    employees = signal<UserProfile[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadEmployees();
    }

    async loadEmployees() {
        this.loading.set(true);
        try {
            const data = await this.employeeService.getAll();
            this.employees.set(data);
        } catch (error) {
            console.error('Error loading employees:', error);
        } finally {
            this.loading.set(false);
        }
    }
}
