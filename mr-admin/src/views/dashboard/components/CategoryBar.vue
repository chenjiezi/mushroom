<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import * as api from '@/api/dashboard'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    this.getCategoryData();
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          itemStyle: {
            normal: {
              //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
              color: function (params) {
                // build a color map as your need.
                var colorList = [
                  '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                  '#8d98b3', '#e5cf0d', '#74b9ff', '#97b552'
                ];
                return colorList[params.dataIndex]
              },
            }
          },
          data: [],
          type: 'bar'
        }]
      })
    },
    getCategoryData() {
      api.getCategoryData().then(res => {
        const categoryNameList = [];
        const categoryNumberList = [];
        res.data.forEach(item => {
          categoryNameList.push(item.name);
          categoryNumberList.push(item.value);
        })
        this.chart.setOption({xAxis: {data: categoryNameList}, series: [{data: categoryNumberList}]});
      })
    }
  }
}

</script>

<style scoped>

</style>
