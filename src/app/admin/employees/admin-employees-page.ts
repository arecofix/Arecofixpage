import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '@app/features/customers/application/services/employee.service';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
    selector: 'app-admin-employees-page',
    standalone: true,
    imports: [CommonModule, RouterLink, Pagination],
    templateUrl: './admin-employees-page.html',
})
export class AdminEmployeesPage implements OnInit {
    private employeeService = inject(EmployeeService);
    employees = signal<UserProfile[]>([]);
    loading = signal(true);
    
    currentPage = signal(1);
    itemsPerPage = signal(24);
    totalItems = signal(0);
    totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage())));

    async ngOnInit() {
        await this.loadEmployees();
    }

    async loadEmployees() {
        this.loading.set(true);
        try {
            const res = await this.employeeService.getPaginated(this.currentPage(), this.itemsPerPage());
            this.employees.set(res.data);
            this.totalItems.set(res.total);
        } catch (error) {
            console.error('Error loading employees:', error);
        } finally {
            this.loading.set(false);
        }
    }

    changePage(page: number) {
        this.currentPage.set(page);
        this.loadEmployees();
    }
}
