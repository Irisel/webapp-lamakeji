define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../../tpl/go/view/danpin.html');
	var model = new M({
		action: 'product/getMyFavoriteList'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		initialize: function() {
			var t = this;
			if (t.model._loaded) {
				t.render();
			} else {
				t.listenTo(t.model, "sync", function() {
					t.render();
				});
			}
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
            if(data.data.result && data.data.result.length>1)data.data.result = data.data.result.slice(0,2);
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			Jser.loadimages(t.$el);
		}
	});
	return function(pars) {
		model.set({
			pars: {

			}
		});
		return new V({
			el: pars.el
		});
	}
})