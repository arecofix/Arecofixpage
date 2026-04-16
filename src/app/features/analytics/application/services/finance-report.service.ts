import { Injectable } from '@angular/core';
import { MonthlyRevenue, DashboardStats } from '../../domain/repositories/analytics.repository';
import { NumberUtils } from '@app/shared/utils/number.utils';

@Injectable({
  providedIn: 'root'
})
export class FinanceReportService {

  async downloadMonthlyPDF(month: MonthlyRevenue): Promise<void> {
    const { jsPDF } = await import('jspdf') as any;
    const { default: autoTable } = await import('jspdf-autotable') as any;
    const doc = new jsPDF();
    const primaryColor = '#3b82f6';
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);
    doc.text(`REPORTE MENSUAL: ${month.label}`, 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generado por Arecofix Dashboard - ${new Date().toLocaleString()}`, 15, 30);
    
    const margin = NumberUtils.calculateMargin(month.gross_revenue, month.net_profit);

    autoTable(doc, {
      startY: 50,
      head: [['Concepto', 'Monto']],
      body: [
        ['Ingresos Brutos', NumberUtils.formatCurrency(month.gross_revenue)],
        ['Ganancia Real', NumberUtils.formatCurrency(month.net_profit)],
        ['Costo de Insumos/Stock', NumberUtils.formatCurrency(month.cost)],
        ['Margen de Ganancia', `${margin}%`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save(`Arecofix_Reporte_${month.period}.pdf`);
  }

  async downloadTotalPDF(stats: DashboardStats, margin: number): Promise<void> {
    const { jsPDF } = await import('jspdf') as any;
    const { default: autoTable } = await import('jspdf-autotable') as any;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Reporte Financiero Histórico - Arecofix', 15, 20);
    
    doc.setFontSize(10);
    doc.text(`Total Bruto: ${NumberUtils.formatCurrency(stats.total_gross_revenue)}`, 15, 30);
    doc.text(`Costo Total: ${NumberUtils.formatCurrency(stats.total_cost)}`, 15, 35);
    doc.text(`Ganancia Real: ${NumberUtils.formatCurrency(stats.total_net_profit)}`, 15, 40);
    doc.text(`Margen Promedio: ${margin}%`, 15, 45);

    const body = stats.monthly_breakdown.map((m: MonthlyRevenue) => [
      m.label,
      NumberUtils.formatCurrency(m.gross_revenue),
      NumberUtils.formatCurrency(m.cost),
      NumberUtils.formatCurrency(m.net_profit),
      `${NumberUtils.calculateMargin(m.gross_revenue, m.net_profit)}%`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Periodo', 'Bruto', 'Costo', 'Ganancia', 'Margen %']],
      body: body,
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`Arecofix_Reporte_Historico_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  downloadCSV(stats: DashboardStats, margin: number): void {
    const header = ['Periodo', 'Ingresos Brutos', 'Costos', 'Ganancia Real', 'Margen %'];
    const rows = stats.monthly_breakdown.map((m: MonthlyRevenue) => [
      m.label,
      m.gross_revenue,
      m.cost,
      m.net_profit,
      NumberUtils.calculateMargin(m.gross_revenue, m.net_profit)
    ]);

    const csvContent = [
      header.join(';'),
      ...rows.map((r: any[]) => r.join(';')),
      '',
      ['TOTAL GENERAL', stats.total_gross_revenue, stats.total_cost, stats.total_net_profit, margin].join(';')
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arecofix-reporte-financiero-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private printWindow(content: string): void {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(content);
      win.document.close();
      win.print();
    }
  }
}
