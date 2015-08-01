define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/golist/index.html');
	var list_tpl = require('text!../../../tpl/golist/view/list.html');
	var model = new M({
		action: 'gogroup/getDetail'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-back": "goback",
			"click .js-share": "doShare"
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
            data.product = data.data.product;
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			if (data.length != 0) {
				var _html = _.template(list_tpl, data);
				t.$el.find(".js-list-area").append(_html);
				Jser.loadimages(t.$el.find(".js-list-area"));
			}
			t.setShare();
		},
		goback: function() {
			var t = this;
			if (window.history && window.history.length > 2) {
				window.history.back();
			} else {
				window.location.href = "#";
			}
		},
		setShare: function() {
			var t = this;
			var fid = t.model.get("pars")["id"];
			// var url = ST.PATH.SHARE + "?fid=" + fid;
			var shareTitle = Jser.getItem("fid" + fid)+"－妈咪手袋";
			// alert("fid:"+fid+",name:"+Jser.getItem("fid" + fid));
			var descContent = "妈咪口袋";
//			var url = 'http://www.lamakeji.com/mamago/index.php/weixin/productShare?fid=' + fid + '&shareUserId=' + Jser.getItem("user_id") + '&tpid=4&topic=' + shareTitle + '&ftitle=' + descContent + '&from=singlemessage&isappinstalled=1';
            var url = 'http://www.lamakeji.com/webapp/#share/index/fid:'+ fid +'/userid:'+ Jser.getItem("user_id") +'/?share=true';
			Jser.setshare({
				imgUrl: "",
				lineLink: url,
				shareTitle: shareTitle, //"妈咪口袋" + Jser.getItem("fid" + fid),
				descContent: descContent
			});
		},
		doShare: function() {
			Jser.share();
		},
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
		}
	});
	return function(pars) {
		model.set({
			pars: {
				"id": pars.id,
                "expand": "product"
			}
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});