import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { EmployeeService } from '@app/features/customers/application/services/employee.service';
import { TenantService } from '@app/core/services/tenant.service';

interface AvailableUser {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
}

@Component({
    selector: 'app-admin-employee-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-employee-form-page.html',
})
export class AdminEmployeeFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private auth = inject(AuthService);
    private employeeService = inject(EmployeeService);
    private tenantService = inject(TenantService);

    id: string | null = null;
    form = signal({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'staff',
        avatar_url: '',
        password: '',
    });

    // Modo de creación: nuevo usuario o asignar existente
    creationMode = signal<'new' | 'existing'>('new');
    selectedUserId = signal<string | null>(null);
    
    // Propiedad para ngModel binding
    get creationModeValue(): 'new' | 'existing' {
        return this.creationMode();
    }
    
    set creationModeValue(value: 'new' | 'existing') {
        this.creationMode.set(value);
    }
    
    // Propiedad para ngModel binding de selectedUserId
    get selectedUserIdValue(): string | null {
        return this.selectedUserId();
    }
    
    set selectedUserIdValue(value: string | null) {
        this.selectedUserId.set(value);
    }
    
    // Usuarios disponibles para asignar
    availableUsers = signal<AvailableUser[]>([]);
    loadingUsers = signal(false);

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        
        // Cargar usuarios disponibles si es creación nueva
        if (!this.id) {
            await this.loadAvailableUsers();
        }
        
        if (this.id) {
            try {
                const data = await this.employeeService.getById(this.id);
                if (data) {
                    this.form.set({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        role: data.role || 'staff',
                        avatar_url: data.avatar_url || '',
                        password: '', // We don't fetch passwords, it's only here to satisfy type logic when saving
                    });
                }
            } catch (error) {
                console.error('Error fetching employee:', error);
                this.error.set('No se pudo cargar el empleado.');
            }
        }
        this.loading.set(false);
    }

    async loadAvailableUsers() {
        this.loadingUsers.set(true);
        try {
            const supabase = this.auth.getSupabaseClient();
            const { data, error } = await supabase
                .from('available_users_for_employee')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading available users:', error);
                this.error.set('No se pudieron cargar los usuarios disponibles.');
            } else {
                this.availableUsers.set(data || []);
            }
        } catch (error) {
            console.error('Error loading available users:', error);
            this.error.set('Error al cargar usuarios disponibles.');
        } finally {
            this.loadingUsers.set(false);
        }
    }

    onUserSelect(userId: string) {
        this.selectedUserId.set(userId);
        
        // Cargar datos del usuario seleccionado en el formulario
        const user = this.availableUsers().find(u => u.id === userId);
        if (user) {
            this.form.set({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email,
                phone: user.phone || '',
                role: 'staff',
                avatar_url: user.avatar_url || '',
                password: '', // No necesita contraseña para usuario existente
            });
        }
    }

    onCreationModeChange(mode: 'new' | 'existing') {
        this.creationMode.set(mode);
        this.selectedUserId.set(null);
        
        // Limpiar formulario
        this.form.set({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            role: 'staff',
            avatar_url: '',
            password: '',
        });
    }

    async onFileChange(event: any) {
        const file: File = event.target.files?.[0];
        if (!file) return;
        const supabase = this.auth.getSupabaseClient();
        const filePath = `avatars/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('public-assets').upload(filePath, file);
        if (error) {
            this.error.set(error.message);
            return;
        }
        const { data: publicUrl } = supabase.storage.from('public-assets').getPublicUrl(data.path);
        this.form.update((f) => ({ ...f, avatar_url: publicUrl.publicUrl }));
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        
        try {
            if (this.id) {
                // Actualizar empleado existente
                const { password, ...updatePayload } = this.form();
                await this.employeeService.update(this.id, updatePayload);
            } else {
                // Crear nuevo empleado
                if (this.creationMode() === 'existing') {
                    // Asignar usuario existente como empleado
                    if (!this.selectedUserId()) {
                        throw new Error('Debe seleccionar un usuario existente.');
                    }
                    await this.assignUserAsEmployee();
                } else {
                    // Crear nuevo usuario y empleado
                    const { password, ...updatePayload } = this.form();
                    if (!password || password.length < 6) {
                        throw new Error('La contraseña debe tener al menos 6 caracteres.');
                    }
                    const payloadWithPassword = { ...updatePayload, password };
                    await this.employeeService.create(payloadWithPassword);
                }
            }
            this.router.navigate(['/admin/employees']);
        } catch (e: any) {
            this.error.set(e.message || 'Error al guardar el empleado.');
            console.error('Employee Save Error:', e);
        } finally {
            this.saving.set(false);
        }
    }

    private async assignUserAsEmployee() {
        const supabase = this.auth.getSupabaseClient();
        const tenantId = this.tenantService.getCurrentTenant()?.id;
        
        if (!tenantId) {
            throw new Error('No se pudo determinar el tenant actual.');
        }

        const { data, error } = await supabase.rpc('assign_user_as_employee', {
            p_user_id: this.selectedUserId(),
            p_role: this.form().role,
            p_tenant_id: tenantId
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}
