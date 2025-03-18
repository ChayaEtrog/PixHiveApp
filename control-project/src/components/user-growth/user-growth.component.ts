import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend, ChartType } from 'chart.js';
import { UserService } from '../../services/user.service';
import { NgChartsModule } from 'ng2-charts';
// רישום כל האלמנטים ש-Chart.js צריך בשביל לעבוד
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, Title, Tooltip, Legend);

@Component({
  selector: 'app-user-growth',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './user-growth.component.html',
  styleUrls: ['./user-growth.component.css']
})
export class UserGrowthComponent implements OnInit {
    chartData: any[] = [];
    chartLabels: string[] = [];
    chartOptions: ChartOptions = {
      responsive: true,
    };
    chartType: ChartType = 'bar'; // אפשר גם 'line'
  
    constructor(private userService: UserService) {}
  
    ngOnInit(): void {
      this.userService.getUserGrowth().subscribe(data => {
        this.chartLabels = data.map(d => `${d.month}/${d.year}`);
        this.chartData = [
          { data: data.map(d => d.userCount), label: 'new users' }
        ];
      });
    }
}
