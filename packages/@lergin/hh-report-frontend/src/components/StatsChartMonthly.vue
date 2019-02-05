<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { mixins} from 'vue-class-component'
import { Bar, mixins as chartjsMixins } from 'vue-chartjs'
import { ChartOptions, ChartData, TimeScale, Chart } from 'chart.js'
import merge from 'lodash/merge'

Chart.defaults.global

@Component
export default class StatsChartTime extends mixins(chartjsMixins.reactiveProp, Bar) {
  public chartData!: ChartData

  public get options(): ChartOptions {
    let options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            offset: true,
            distribution: 'linear',
            display: true
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
    }

    if ((this as any).$vuetify.dark) {
      options = merge(options, {
        scales: {
          xAxes: [{
            gridLines: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            scaleLabel: {
              fontColor: 'white'
            },
            ticks: {
              fontColor: 'white'
            }
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            scaleLabel: {
              fontColor: 'white'
            },
            ticks: {
              fontColor: 'white'
            }
          }]
        }
      })
    }
    
    return options;
  }

  mounted () {
    this.renderChart(this.chartData, this.options)
  }

  @Watch('options')
  public updateChart() {
    this.$data._chart.options = this.options
    this.$data._chart.update()
  }
}
</script>
