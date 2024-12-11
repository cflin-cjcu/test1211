var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

option = {
  xAxis: {
    type: 'category',
    data: ['星期一', '星期二', '星期三', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [100, 200, 224, 333, 135, 147, 260],
      type: 'line'
    }
  ]
};

option && myChart.setOption(option);
