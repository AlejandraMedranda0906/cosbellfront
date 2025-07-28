import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService, StatisticsDto } from '../../../services/statistics.service';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.css']
})
export class DashboardStatsComponent implements OnInit {
  stats!: StatisticsDto;
  loading = true;
  error = '';
  selectedPeriod: 'day' | 'week' | 'month' | 'all' = 'day';

  // Gráfico por servicio
  chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#66bb6a', '#42a5f5', '#ff7043', '#ab47bc', '#ffa726']
    }]
  };

  // Gráfico por empleado
  employeeChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#ffd600', '#ff7043', '#ab47bc', '#42a5f5', '#66bb6a']
    }]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  // Variables para el modal
  selectedDetail: any = null;
  modalTitle: string = '';

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = '';
    this.statisticsService.getStatistics(this.selectedPeriod).subscribe({
      next: (data: StatisticsDto) => {
        this.stats = data;
        this.loading = false;
        this.error = '';

        // Servicios
        this.chartData.labels = data.servicesBreakdown.map(s => s.name);
        this.chartData.datasets[0].data = data.servicesBreakdown.map(s => s.count);

        // Empleados
        // Solo si tienes employeesBreakdown en tu dto:
        if ((data as any).employeesBreakdown && (data as any).employeesBreakdown.length > 0) {
          this.employeeChartData.labels = (data as any).employeesBreakdown.map((e: any) => e.name);
          this.employeeChartData.datasets[0].data = (data as any).employeesBreakdown.map((e: any) => e.count);
        } else {
          this.employeeChartData.labels = [];
          this.employeeChartData.datasets[0].data = [];
        }
      },
      error: () => {
        this.error = 'Error al cargar estadísticas';
        this.loading = false;
      }
    });
  }

  // MODAL LOGIC
  openDetailModal(type: 'employee' | 'service') {
    if (type === 'employee' && (this.stats as any).employeesBreakdown) {
      this.selectedDetail = (this.stats as any).employeesBreakdown;
      this.modalTitle = 'Detalle de Empleados';
    } else if (type === 'service' && this.stats.servicesBreakdown) {
      this.selectedDetail = this.stats.servicesBreakdown;
      this.modalTitle = 'Detalle de Servicios';
    } else {
      this.selectedDetail = null;
      this.modalTitle = '';
    }
  }

  closeModal() {
    this.selectedDetail = null;
    this.modalTitle = '';
  }
}
