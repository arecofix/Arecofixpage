import { UpdateRepairUseCase } from './update-repair.use-case';
import { AdminRepairService } from '../services/admin-repair.service';
import { TestBed } from '@angular/core/testing';

describe('UpdateRepairUseCase (TSK-02, TSK-02b)', () => {
    let useCase: UpdateRepairUseCase;
    let mockAdminRepairService: any;

    beforeEach(() => {
        mockAdminRepairService = {
            update: jest.fn().mockResolvedValue(undefined)
        };

        TestBed.configureTestingModule({
            providers: [
                UpdateRepairUseCase,
                { provide: AdminRepairService, useValue: mockAdminRepairService }
            ]
        });

        useCase = TestBed.inject(UpdateRepairUseCase);
    });

    it('should throw an error if customer_name is "Cliente"', async () => {
        try {
            await useCase.execute('123', { customer_name: 'Cliente' });
            fail('Should have thrown error');
        } catch (e: any) {
            expect(e.message).toContain('CustomerName cannot be a generic fallback like "Cliente"');
        }
        expect(mockAdminRepairService.update).not.toHaveBeenCalled();
    });

    it('should throw an error if customer_name is empty', async () => {
        try {
            await useCase.execute('123', { customer_name: '   ' });
            fail('Should have thrown error');
        } catch (e: any) {
            expect(e.message).toContain('CustomerName cannot be empty');
        }
        expect(mockAdminRepairService.update).not.toHaveBeenCalled();
    });

    it('should throw an error if device_model is "Equipo Genérico"', async () => {
        try {
            await useCase.execute('123', { device_model: 'Equipo Genérico' });
            fail('Should have thrown error');
        } catch (e: any) {
            expect(e.message).toContain('DeviceModel cannot be a generic fallback like "Equipo Genérico"');
        }
        expect(mockAdminRepairService.update).not.toHaveBeenCalled();
    });

    it('should proceed if customer_name and device_model are valid', async () => {
        await useCase.execute('123', { customer_name: 'Juan Perez', device_model: 'iPhone 13' });
        expect(mockAdminRepairService.update).toHaveBeenCalledWith('123', { customer_name: 'Juan Perez', device_model: 'iPhone 13' });
    });

    it('should proceed if customer_name and device_model are NOT provided (dirty check filtering)', async () => {
        await useCase.execute('123', { current_status_id: 3 });
        expect(mockAdminRepairService.update).toHaveBeenCalledWith('123', { current_status_id: 3 });
    });
});
