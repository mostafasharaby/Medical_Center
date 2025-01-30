import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent  implements OnInit {

  private ApexCharts: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('apexcharts').then((module) => {
        this.ApexCharts = module.default; 
        
        this.smallchart1();        
        this.smallchart2();
      });
    }
  }

  smallchart1() {
    const options = {
      chart: {
        height: 400,
        type: 'line',
        shadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 1,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#00C0B6', '#F6A817'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'High - 2024',
          data: [19, 15, 14, 24, 25, 19, 22, 24, 25],
        },
        {
          name: 'Low - 2024',
          data: [7, 11, 22, 18, 31, 13, 26, 16, 31],
        },
      ],
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.0,
        },
      },
      markers: {
        size: 6,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep'],
        title: {
          text: 'Expense',
          style: {
            color: '#9aa0ac',
          },
        },
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Income',
          style: {
            color: '#9aa0ac',
          },
        },
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
        min: 5,
        max: 40,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart1'), options);
    chart.render();
  }

  smallchart2() {
    const options = {
      series: [
        {
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58],
        },
        {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105],
        },
      ],
      chart: {
        type: 'bar',
        height: 400,
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#6F42C1', '#AEAEAE'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
          style: {
            color: '#9aa0ac',
          },
        },
        labels: {
          style: {
            colors: '#9aa0ac',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart2'), options);
    chart.render();
  }

  cards = [
    {
      id: 'chart1',
      title: 'CENTER SURVEY',
      size: 'col-md-8', 
      tools: [
        { icon: 'fa-repeat', action: 'refresh' },
        { icon: 'fa-chevron-down', action: 'collapse' },
        { icon: 'fa-times', action: 'close' }
      ]
    },
    {
      id: 'chart2',
      title: 'CENTER SURVEY',
      size: 'col-md-4',
      tools: [
        { icon: 'fa-repeat', action: 'refresh' },
        { icon: 'fa-chevron-down', action: 'collapse' },
        { icon: 'fa-times', action: 'close' }
      ]
    }
  ];

} 


