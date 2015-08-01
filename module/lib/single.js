/**
 * Created with PyCharm.
 * User: ge
 * Date: 15-5-7
 * Time: 下午3:29
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
  // 通过 require 引入依赖
  var $ = require('$');

  exports.status_init = function(){
        var status_access = {
                prepare: true,
                wondering: true,
                born: false,
                during: false
        };
        var qdmap = {
		    prepare: 1,
		    during: 2,
		    born: 5,
		    wondering: 0
	    };
        var sign_lama = function(status){
                if(window.localStorage){
                    var lama = Jser.getItem('lama');
                    if(!lama){
                        Jser.setItem('lama', JSON.stringify({status: status, signed:status_access[status]}));
                    }else{
                        var lama_json = JSON.parse(lama);
                        lama_json.xinxistatus = status;
                        lama_json.signed = status_access[status];
                        Jser.setItem('lama', JSON.stringify(lama_json));
                    }
                }
        };
        var redirect = function(status){
            if(status_access[status]){
                location.href = "/webapp";
            }else{
                location.href = "/webapp/date.html";
            }
        }
        var logged = function(status){
			var _data = {
                    "timeblock": qdmap[status]
			};
			Jser.getJSON(ST.PATH.ACTION + "user/update?timestamp=1437323557043&version=1.0&client=H5", _data, function(data) {
                sign_lama(status);
                redirect(status);
			}, function() {

			}, "post");
        }

        $('.status-icon').click(function(e){
            var status = $(e.target).data('status');
            if(Jser.getItem('phone')){
                logged(status);
            }else{
                sign_lama(status);
                redirect(status);
            }
        })
  };

  exports.date_init = function(){
        var baby_form_date = $('#baby-form-date');
        $('.js-back').click(function(){
          if (window.history && window.history.length) {
	          window.history.back();
	      } else {
		      window.location.href = "/webapp/tourist.html";
	      }
        });
      var mobileType = {
          Android: function() {
            return navigator.userAgent.match(/Android/i) ? true : false;
          },
          iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
          },
          check: function(){
              var _this = this;
              if(_this.Android()){
                  return 'android';
              }else if(this.iOS()){
                  return 'ios';
              }else{
                  return undefined;
              }
          }
      };
      var mobile = mobileType.check();
      var date_submit = function(lama_json){
            if(Jser.getItem('phone')){
			var _data = {
                    "sex": lama_json.xinxigender == 'female'?'1': '0',
                    "birthday": lama_json.xinxichoosen
			};
			Jser.getJSON(ST.PATH.ACTION + "user/update?timestamp=1437323557043&version=1.0&client=H5", _data, function(data) {
                    Jser.setItem("sex", data.data.sex);
					Jser.setItem("timeblock", data.data.timeblock);
                    Jser.setItem("birthday", data.data.birthday);
                location.href = "/webapp";
			    }, function() {

			    }, "post");
            }else{
                location.href = "/webapp";
            }
      };
      if(mobile == 'android'){
          require('plusin/mTime/date')($);
//          $('.demo').append("<input id='beginTime' class='kbtn'/>");
          $('#beginTime').date({
                beginTime: '#baby-form-date'
          });
          $(".right-span").bind("click", function()
                {
                    $('#beginTime').trigger("click");
                }
          )
      }else if (mobile == 'ios'){
//          $('.demo').append("<input id='beginTime' type='date' class='iphone-date'/>");
          $(".right-span").click(function(event){
                event.preventDefault();
                 $('#beginTime').trigger('focus');
                }
          );
          $('#beginTime').on("blur", function(){

              var value  = this.value;
              if(value){
                   baby_form_date[0].innerText = value;
                   baby_form_date.data('date', value);
                   $('#baby-form-date').data('date', value);
              }
          })
      }
      if(window.localStorage){
          var lama = Jser.getItem('lama');
          var lama_json = JSON.parse(lama);
          var status = lama_json.xinxistatus, form = $('.baby-form');
          if(status=='born'){
              $('#header_date')[0].innerText = '设置出生日期';
              form.removeClass('init-form');
              form.addClass('born-form');
              $('.gender span').click(function(e){
                    if($(e.target).hasClass('gender-off')){
                        $('.gender-on').removeClass('gender-on').addClass('gender-off');
                        $(e.target).removeClass('gender-off').addClass('gender-on');
                    }
              })
          }else if(status=='during'){
              $('#header_date')[0].innerText = '设置预产日期';
              form.removeClass('init-form');
              form.addClass('during-form');
          }
          $('.btn-submit').click(function(){
              var lama = Jser.getItem('lama');
              var lama_json = JSON.parse(lama);
              lama_json.xinxichoosen = $('#baby-form-date').data('date');
              lama_json.xinxigender = $('.gender-on').data('gender');
              lama_json.signed = true;
              Jser.setItem('lama', JSON.stringify(lama_json));
              if(lama_json.xinxichoosen && lama_json.xinxigender)date_submit(lama_json);
          })
      }
          var sex = '1';
          if(Jser.getItem('phone')){
                s = Jser.getItem('birthday');
                sex = Jser.getItem('sex');
                console.log(sex);
          }else{
                s = lama_json.xinxichoosen;
                sex = (lama_json == 'female')?'1': '0';
          }
          if(!s){
            var d = new Date(),vYear = d.getFullYear(),vMon = d.getMonth() + 1,vDay = d.getDate();
            s =vYear+(vMon<10 ? "0" + '-' + vMon : vMon)+ '-' +vDay;
          }
          if(sex == '1'){
              $('.js-male').removeClass('gender-on').addClass('gender-off');
              $('.js-female').removeClass('gender-off').addClass('gender-on');
          }else{
              $('.js-male').removeClass('gender-off').addClass('gender-on');
              $('.js-female').removeClass('gender-on').addClass('gender-off');
          }
          baby_form_date.html(s);
          baby_form_date.data('date', s);

  };
    exports.period_init = function(){
        var idx = Jser.getItem('idx') || '1';
        var el = '.period-'+idx+' .period-center';
        $(el).css('background-color', '#fae2e2');
        $(el).html('<div class="anxis-head"></div>');
        $('.js-back').click(function(){
          if (window.history && window.history.length) {
	          window.history.back();
	      } else {
		      window.location.href = "/webapp/#qingdan/index/idx:1";
	      }
        });
        $('.period-row').click(function(e){
            window.location.href = "/webapp/#qingdan/index/idx:" + $(e.target).parent().data("idx");
        })
  }
});