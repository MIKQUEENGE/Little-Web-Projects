$(document).ready(function() {

  var loadingHint = $('.loading');
  var top250Button = $('#chart-title div').eq(0);
  var newMovieButton = $('#chart-title div').eq(1);
  var oneWeekButton = $('#chart-title div').eq(2);
  var northAmericaButton = $('#chart-title div').eq(3);
  var searchButton = $('#chart-title div').eq(4);

  function newItem(data, index) {
    var item = $('<li class="item">\
              <a href="https://movie.douban.com/subject/1292052/">\
                <em>1</em>\
                <div class="img">\
                  <img src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp">\
                </div>\
                <div class="info">\
                  <div></div>\
                  <div></div>\
                  <div></div>\
                  <div></div>\
                  <div></div>\
                </div>\
              </a>\
            </li>');
    item.find('a').attr('href', data.alt);
    item.find('em').text(index);
    item.find('.img img').attr('src', data.images.small);
    item.find('.info div').eq(0).text(data.title+' / '+data.original_title);
    item.find('.info div').eq(1).text('导演: ' + data.directors.map(function(element) {
      return element.name;
    }).join(' '));
    item.find('.info div').eq(2).text('主演: ' + data.casts.map(function(element) {
      return element.name;
    }).join(' / '));
    item.find('.info div').eq(3).text(data.year + ' / ' + data.genres.join(' '));
    item.find('.info div').eq(4).text(data.rating.average + '分 ' + data.collect_count + '人评价');

    return item;

  }

  function clearHighlight() {
    $('#chart-box ul').html('');
    $('#chart-title div').removeClass("highlight");
    loadingHint.hide();
  }


  var top250 = {
    page: 0,
    loadCount: 10,
    getData: function() {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/top250',
        dataType: 'jsonp',
        data: {
          start: top250.page * top250.loadCount,
          count: top250.loadCount
        },
      })
      .done(function(result) {
        top250.display(result.subjects);
      })
      .fail(function() {
        alert('豆瓣API接口异常');
      });
      
    },
    display: function(data) {
      data.forEach(function(item, index) {
        $('#chart-box ul').append(newItem(item, (top250.page * top250.loadCount) + index + 1));
      });
      loadingHint.text('点击加载更多');
    },
    init: function() {
      top250.page = 0;
      top250.getData();
      loadingHint.text('正在加载...');
      loadingHint.show();
    }
  };

  var otherCharts = {
    getData: function(name) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/'+name,
        dataType: 'jsonp',
        data: {
          start: 0,
          count: 10,
          apikey: '0b2bdeda43b5688921839c8ecb20399b'
        },
      })
      .done(function(result) {
        otherCharts.display(result.subjects, name);
      })
      .fail(function() {
        alert('豆瓣API接口异常');
      });
      
    },
    display: function(data, name) {
      data.forEach(function(item, index) {
        if (name == 'new_movies') {
          $('#chart-box ul').append(newItem(item, index + 1));
        } else {   
          $('#chart-box ul').append(newItem(item.subject, index + 1));
        }
      });
    },
  };

  loadingHint.click(function() {
    loadingHint.text('正在加载...');
    top250.page++;
    top250.getData();
  });

  top250Button.click(function() {
    clearHighlight();
    top250Button.addClass('highlight');
    top250.init();
  });

  newMovieButton.click(function() {
    clearHighlight();
    newMovieButton.addClass('highlight');
    otherCharts.getData('new_movies');
  });

  oneWeekButton.click(function() {
    clearHighlight();
    oneWeekButton.addClass('highlight');
    otherCharts.getData('weekly');
  });

  northAmericaButton.click(function() {
    clearHighlight();
    northAmericaButton.addClass('highlight');
    otherCharts.getData('us_box');
  });

  searchButton.click(function() {
    alert('暂未实现');
  });

  top250.init();

});