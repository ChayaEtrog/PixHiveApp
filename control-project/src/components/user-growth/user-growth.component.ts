import { Component } from '@angular/core';
import { ChartData, ChartOptions, Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend } from 'chart.js';
import { ChartsModule } from 'ng2-charts';
import { UserService } from '../../services/user.service';

// רישום כל האלמנטים ש-Chart.js צריך בשביל לעבוד
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend);

@Component({
  selector: 'app-user-growth',
  standalone: true,
  imports: [ChartsModule],
  templateUrl: './user-growth.component.html',
  styleUrls: ['./user-growth.component.css']
})
export class UserGrowthComponent {
  public userGrowthData: any[] = [];

  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'צמיחה במספר המשתמשים',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true
      },
      title: {
        display: true,
        text: 'גרף צמיחת משתמשים'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'חודש/שנה'
        }
      },
      y: {
        title: {
          display: true,
          text: 'מספר משתמשים'
        },
        beginAtZero: true
      }
    }
  };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserGrowthData();
  }

  loadUserGrowthData(): void {
    this.userService.getUserGrowth().subscribe({
      next: (data: any[]) => {
        console.log('User Growth Data:', data);
        this.userGrowthData = data;
        this.prepareChartData();
      },
      error: (error) => {
        console.error('שגיאה בטעינת נתוני צמיחת משתמשים:', error);
        alert('אירעה שגיאה בעת טעינת הנתונים. נסי שוב מאוחר יותר.');
      }
    });
  }

  prepareChartData(): void {
    const labels: string[] = [];
    const userCounts: number[] = [];

    this.userGrowthData.forEach(item => {
      const label = `${item.month}/${item.year}`;
      labels.push(label);
      userCounts.push(item.userCount);
    });

    console.log("Labels:", labels);

    this.chartData.labels = labels;
    this.chartData.datasets[0].data = userCounts;
  }
}
