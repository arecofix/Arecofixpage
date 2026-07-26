import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jest.Mocked<AuthService>;

  beforeEach(async () => {
    // 1. Creamos un mock estricto del servicio
    const spy = { resetPassword: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe requerir un email válido', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('debe ejecutar el escenario de ÉXITO correctamente', async () => {
    // Arrange: Simulamos que Supabase responde sin error
    authServiceSpy.resetPassword.mockReturnValue(Promise.resolve(null));
    
    component.form.controls['email'].setValue('test@correo.com');
    
    // Act
    await component.resetPassword();

    // Assert
    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('test@correo.com');
    expect(component.loading).toBeFalsy();
    expect(component.success).toContain('Código enviado');
    expect(component.error).toBe('');
  });

  it('debe manejar el escenario de ERROR (usuario no encontrado)', async () => {
    // Arrange: Simulamos error
    const mockError = { message: 'User not found' };
    authServiceSpy.resetPassword.mockReturnValue(Promise.resolve(mockError.message));
    
    component.form.controls['email'].setValue('fake@correo.com');
    
    // Act
    await component.resetPassword();

    // Assert
    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('fake@correo.com');
    expect(component.loading).toBeFalsy();
    expect(component.success).toBe('');
    expect(component.error).toContain('No existe una cuenta');
  });
});
