import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { permissionGuard } from './permission.guard';
import { PermissionService } from '../services/permission.service';
import { AuthService } from '../services/auth.service';

describe('permissionGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let permissionServiceSpy: jasmine.SpyObj<PermissionService>;
  let authServiceSpy: any;

  beforeEach(() => {
    // We are using Jest, so we use jest.fn() for mocks, not jasmine.createSpyObj
    routerSpy = {
      createUrlTree: jest.fn()
    } as any;

    permissionServiceSpy = {
      isLoaded: jest.fn(),
      loadPermissions: jest.fn(),
      hasPermission: jest.fn()
    } as any;

    authServiceSpy = {
      isSuperAdmin: jest.fn().mockReturnValue(false),
      getCurrentProfile: jest.fn().mockReturnValue({ role: 'EMPLEADO' })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PermissionService, useValue: permissionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
  });

  const runGuard = async (permissions: string | string[]) => {
    const guard = permissionGuard(permissions);
    const result = await TestBed.runInInjectionContext(() => {
      // Mocking the required arguments for CanActivateFn
      return guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    });
    return result;
  };

  it('should allow access if user has the permission', async () => {
    permissionServiceSpy.isLoaded.mockReturnValue(true);
    permissionServiceSpy.hasPermission.mockReturnValue(true);

    const result = await runGuard('company.identity:edit:global');
    expect(result).toBe(true);
    expect(permissionServiceSpy.hasPermission).toHaveBeenCalledWith('company.identity:edit:global');
  });

  it('should redirect to 403 if user lacks permission', async () => {
    permissionServiceSpy.isLoaded.mockReturnValue(true);
    permissionServiceSpy.hasPermission.mockReturnValue(false);
    
    // Simulate Router returning a UrlTree object
    const urlTree = {} as any;
    routerSpy.createUrlTree.mockReturnValue(urlTree);

    const result = await runGuard('company.identity:edit:global');
    expect(result).toBe(urlTree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/403']);
  });

  it('should load permissions if not loaded', async () => {
    permissionServiceSpy.isLoaded.mockReturnValue(false);
    permissionServiceSpy.loadPermissions.mockResolvedValue(undefined);
    permissionServiceSpy.hasPermission.mockReturnValue(true);

    await runGuard('company.identity:edit:global');
    expect(permissionServiceSpy.loadPermissions).toHaveBeenCalled();
  });
});
