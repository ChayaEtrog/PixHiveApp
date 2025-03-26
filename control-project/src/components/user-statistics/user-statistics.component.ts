import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { SystemStatisticsDto, UserGrowth, UserStatisticsDto } from '../../types/UserGrowth';
import { UserService } from '../../services/user.service';
import { StatisticsService } from '../../services/statistics.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { MatPaginator } from '@angular/material/paginator';
import {MatDividerModule} from '@angular/material/divider';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-user-statistics',
  standalone: true,
  imports: [MatTableModule, MatCardModule, NgChartsModule,MatPaginator,MatDividerModule],
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {
  public userGrowthData: UserGrowth[] = [];
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'User Growth',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true 
  });
  
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Month/Year' } },
      y: { title: { display: true, text: 'Users Count' } }
    }
  };

  // Bar chart - System Summary (Users, Albums, Files)
  public systemBarChartData: ChartData<'bar'> = {
    labels: ['System Statistics'],
    datasets: [
      {
        label: 'Users',
        data: [],
        backgroundColor: 'rgba(255, 44, 118, 0.7)'
      },
      {
        label: 'Albums',
        data: [],
        backgroundColor: 'rgba(255, 206, 86, 0.7)'
      },
      {
        label: 'Files',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)'
      }
    ]
  };

  public systemBarChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' } }
  };

  // System stats
  public systemStatistics: SystemStatisticsDto = {
    totalUsers: 0,
    totalAlbums: 0,
    totalFiles: 0
  };

  // Table
  displayedColumns: string[] = ['username', 'albumCount', 'fileCount'];
  dataSource!: MatTableDataSource<UserStatisticsDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ViewChilds for both charts
  @ViewChild('systemBarChart') systemBarChart!: BaseChartDirective;
  @ViewChild('userGrowthChart') userGrowthChart!: BaseChartDirective;

  constructor(
    private userService: UserService,
    private statisticsService: StatisticsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUserGrowthData();
    this.loadUserStatistics();
    this.loadSystemStatistics();
  }

  loadUserGrowthData(): void {
    this.userService.getUserGrowthData().subscribe({
      next: (data: UserGrowth[]) => {
        this.userGrowthData = data;
        this.prepareChartData();
        this.cdr.detectChanges();
        this.userGrowthChart?.update(); 
      },
      error: (error) => {
        this.notyf.error(`Error loading user growth:'${error.error}`)
        console.error('Error loading user growth:', error);
      }
    });
  }

  prepareChartData(): void {
    const labels: string[] = [];
    const userCounts: number[] = [];

    this.userGrowthData.forEach((item: UserGrowth) => {
      const label = `${item.month}/${item.year}`;
      labels.push(label);
      userCounts.push(item.userCount);
    });

    this.chartData = {
      ...this.chartData,
      labels,
      datasets: [{ ...this.chartData.datasets[0], data: userCounts }]
    };
  }

  loadUserStatistics(): void {
    this.statisticsService.getUserStatistics().subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.dataSource = new MatTableDataSource(response.data);
          setTimeout(() => this.dataSource.paginator = this.paginator);
        } else {
          this.notyf.error(`Error loading user statistics:, ${response.errorMessage}`)
          console.error('Error loading user statistics:', response.errorMessage);
        }
      },
      error: (error) => {
        this.notyf.error(`Error loading user statistics:, ${error.error}`)
        console.error('Error loading user statistics:', error);
      }
    });
  }

  loadSystemStatistics(): void {
    this.statisticsService.getSystemStatistics().subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          this.systemStatistics = response.data;

          this.systemBarChartData.datasets[0].data = [this.systemStatistics.totalUsers];
          this.systemBarChartData.datasets[1].data = [this.systemStatistics.totalAlbums];
          this.systemBarChartData.datasets[2].data = [this.systemStatistics.totalFiles];
  
          setTimeout(() => {
            this.cdr.detectChanges(); 
            this.systemBarChart.update();
            console.log('systemBarChart:', this.systemBarChart);
          });
        } else {
          this.notyf.error(`Error loading system statistics:, ${response.errorMessage}`)
          console.error('Error loading system statistics:', response.errorMessage);
        }
      },
      error: (error) => {
        this.notyf.error(`Error loading system statistics:, ${error.error}`)
        console.error('Error loading system statistics:', error);
      }
    });
  }
}
