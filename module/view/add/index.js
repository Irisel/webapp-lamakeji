define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/add/index.html');

	var model = new M({
		// action: 'http://myyglah.duapp.com/front/queryBeauticianWorks.action'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-add-sure": "doAddSure",
            "click .js-photo": "choosePhoto"
		},
		initialize: function() {
			var t = this;
			t.render();
		},
		//待优化
		render: function() {
			var t = this;
			t.$el.show().html(t.template);
			if (!App.isLogin()) {
				return false;
			}
		},
		doAddSure: function() {
            Jser.uploadImage();
//			if (!App.isLogin()) {
//				return false;
//			}
//			var t = this;
//			var val = $.trim(t.$el.find(".js-add-val").val());
//			if (val.length != 0) {
//				t.$el.find(".js-add-error").hide();
//				var _data = {
//					"name": val,
//                    "picture": ''
//				};
//				Jser.getJSON(ST.PATH.ACTION + "gogroup/create?timestamp=1437323557043&version=1.0&client=H5", _data, function(data) {
//					Jser.alert("新建go单成功", function() {
//						window.location.hash = "#go/index";
//					});
//				}, function() {
//
//				}, "post");
//			} else {
//				t.$el.find(".js-add-error").show().find("span").text("请填写go单名称");
//			}
		},
		changePars: function() {
			var t = this;
			t.$el.find(".js-add-val").val("");
			t.$el.show();
		},
        choosePhoto: function(e){
            console.log('choosePhoto');
            Jser.chooseImg($(e.currentTarget));
        }
	});
	return function(pars) {
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
})