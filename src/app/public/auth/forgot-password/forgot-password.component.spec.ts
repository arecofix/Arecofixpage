import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // 1. Creamos un mock estricto del servicio
    const spy = jasmine.createSpyObj('AuthService', ['resetPassword']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
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

  it('debe ejecutar el escenario de ÉXITO correctamente', fakeAsync(() => {
    // Arrange: Simulamos que Supabase responde sin error
    authServiceSpy.resetPassword.and.returnValue(Promise.resolve(null));
    
    component.form.controls['email'].setValue('test@correo.com');
    
    // Act
    component.resetPassword();
    tick(); // Resolvemos la promesa

    // Assert
    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('test@correo.com');
    expect(component.loading).toBeFalse();
    expect(component.success).toContain('Te enviamos un email');
    expect(component.error).toBe('');
  }));

  it('debe manejar el escenario de ERROR (usuario no encontrado)', fakeAsync(() => {
    // Arrange: Simulamos error
    const mockError = { message: 'User not found' };
    authServiceSpy.resetPassword.and.returnValue(Promise.resolve(mockError.message));
    
    component.form.controls['email'].setValue('fake@correo.com');
    
    // Act
    component.resetPassword();
    tick();

    // Assert
    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('fake@correo.com');
    expect(component.loading).toBeFalse();
    expect(component.success).toBe('');
    expect(component.error).toContain('No existe una cuenta');
  }));
});
