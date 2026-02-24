import { RepairStatus } from '../entities/repair.entity';

export interface StatusUI {
    label: string;
    class: string;
    description: string;
}

export class RepairStatusUtils {
    static getStatusUI(statusId: number): StatusUI {
        const statuses: Record<number, StatusUI> = {
            [RepairStatus.PENDING_DIAGNOSIS]: {
                label: 'PENDIENTE DE DIAGNÓSTICO',
                class: 'bg-amber-100 text-amber-800 border-amber-200',
                description: 'El equipo ha sido recibido y espera ser revisado por un técnico.'
            },
            [RepairStatus.SUPPLY_MANAGEMENT]: {
                label: 'GESTIÓN DE REPUESTOS',
                class: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                description: 'Estamos localizando o esperando los repuestos necesarios.'
            },
            [RepairStatus.IN_PROGRESS]: {
                label: 'EN REPARACIÓN',
                class: 'bg-blue-100 text-blue-800 border-blue-200',
                description: 'Un técnico está trabajando actualmente en su equipo.'
            },
            [RepairStatus.QUALITY_CONTROL]: {
                label: 'CONTROL DE CALIDAD',
                class: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                description: 'La reparación ha finalizado y estamos testeando todas las funciones.'
            },
            [RepairStatus.READY_FOR_PICKUP]: {
                label: 'LISTO PARA RETIRAR',
                class: 'bg-green-100 text-green-800 border-green-200',
                description: '¡Buenas noticias! Puede pasar a retirar su equipo.'
            },
            [RepairStatus.DELIVERED]: {
                label: 'ENTREGADO',
                class: 'bg-slate-100 text-slate-800 border-slate-200',
                description: 'El equipo ha sido entregado al cliente conforme.'
            },
            [RepairStatus.CANCELLED]: {
                label: 'CANCELADO',
                class: 'bg-rose-100 text-rose-800 border-rose-200',
                description: 'La reparación ha sido cancelada o fue rechazada.'
            }
        };

        return statuses[statusId] || {
            label: 'DESCONOCIDO',
            class: 'bg-slate-100 text-slate-700',
            description: 'Estado no identificado.'
        };
    }

    static getAdminBadgeClass(statusId: number): string {
        switch (statusId) {
            case RepairStatus.PENDING_DIAGNOSIS: return 'badge-warning';
            case RepairStatus.SUPPLY_MANAGEMENT: return 'badge-info';
            case RepairStatus.IN_PROGRESS: return 'badge-primary';
            case RepairStatus.QUALITY_CONTROL: return 'badge-accent';
            case RepairStatus.READY_FOR_PICKUP: return 'badge-success';
            case RepairStatus.DELIVERED: return 'badge-ghost opacity-70';
            case RepairStatus.CANCELLED: return 'badge-error';
            default: return 'badge-ghost';
        }
    }
}
