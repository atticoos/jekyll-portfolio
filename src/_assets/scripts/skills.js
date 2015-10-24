(function ($) {
  'use strict';

  $(document).ready(function () {
    var charts = [{
      id: 'chart-1',
      data: [
        {value: 33, color: '#e04f14'},
        {value: 33, color: '#5e73b5'},
        {value: 33, color: '#9c120f'}
      ]
    }, {
      id: 'chart-2',
      data: [
        {value: 25, color: '#a9cc62'},
        {value: 50, color: '#146ec0'},
        {value: 25, color: '#f07c00'}
      ]
    }, {
      id: 'chart-3',
      data: [
        {value: 40, color: '#9cc00f'},
        {value: 20, color: '#489ff2'},
        {value: 40, color: '#000000'}
      ]
    }, {
      id: 'chart-4',
      data: [
        {value: 33, color: '#99be4f'},
        {value: 33, color: '#ffcc2f'},
        {value: 33, color: '#e48632'}
      ]
    }];

    _.forEach(charts, function (chart) {
      var element = document.getElementById(chart.id);
      new Chart(element.getContext('2d')).Pie(chart.data);
    });
  });
}).call(this, jQuery);
