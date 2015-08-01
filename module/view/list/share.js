define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/list/share.html');
	var model = new M({
		action: 'favorite/getDetail'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-back": "goback",
            "click .js-download": "download"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			var html = _.template(t.template, data);
			t.$el.show().html(html);
            t.$el.find('.strategy-share').html(data.data.h5content);
            var _height = $('.js-wrapper').height();
            t.$el.find('.wrapper-share').height(_height)
		},
		goback: function() {
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#";
			}
		},
        download: function(){
//            var ua = window.navigator.userAgent.toLowerCase();
//            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
//                this.showDownload();
//            }else{
//                if(mobile == 'ios'){
                    window.location.href = 'http://www.lamakeji.com/down.php';
//                }else if(mobile == 'android'){
//                    window.location.href = 'http://www.lamakeji.com/down.php';
//                }
//            }
        },
		changePars: function(pars) {
			var t = this;
			t.model.set("pars", pars);
		}
	});

	return function(pars) {
		model.set({
			pars: {
				"id": pars.fid,
                "expand": "product"
			}
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});