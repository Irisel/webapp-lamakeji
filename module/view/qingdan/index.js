define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/qingdan/index.html');
	var list_tpl = require('text!../../../tpl/qingdan/view/list.html');
	window.global_qd_type = 0;
	var model = new M({
		action: 'category/getList'
	});
	/* 
		-365,-280备孕~0周
		-280,-189 0~12周
		-189,-77 13~28周
		-77,0 29~40周
		0,30 出生~满月
		30,100 满月~百天
		100,182 百天~半岁
		182,365 半岁~一岁
		365,547 一岁~一岁半
		547,730 一岁半~两岁
		730,1095 两岁~三岁
	*/
	var qdmap = Jser.qdmap;
	// var indexSelf;
    var _index = Jser.getItem('idx') || '1';
	var V = B.View.extend({
		model: model,
		template: H,
		idx:  _index,
		// iTimer: null,
		// isLoad: false, // 当加载数据的时候 禁止使用滑动加载 ,默认是false 即没有加载数据
		// totalSize: 6, // 每次显示的个数
		// page: 1, // 分页
		// totalPage: 1, // 总页数
		events: {
			"click .js-qd-left": "doLeft",
			"click .js-qd-right": "doRight",
			// "click .qd-top-btn": "doSwitchQingdan",
			"click .js-qd-checked": "doCheckdQingdan",
            "click .js-qingdan-period": "doSetPeriod"
//			"click .js-dropdown": "doDropdown"
		},
		initialize: function() {
			var t = this;
			// indexSelf = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
				// t.listenTo(t.model, "sync", function() {
				// 	t.syncRender();
				// });
			});
		},
		//待优化
		render: function() {
			var t = this,
				data = t.model.toJSON();
			data.qdmap = data.period_chosen;
            data.timeblock = t.model.get("pars")["timeblock"];
            data.page = {total: 0, finish: 0};
            var finish = data.data.finish;
            if(finish.systerm)
            $.each(data.data.result, function(key, value){
                    if(finish.systerm.indexOf(value.id)>=0){
                        value.on = true;
                        data.page.finish+=1;
                    }
            });
            if(finish.user)
            $.each(data.data.user, function(key, value){
                    if(finish.user.indexOf(value.id)>=0){
                        value.on = true;
                        data.page.finish+=1;
                    }
            });
            data.page.total = (data.data.result || []).length + (data.data.user || []).length;
            data.page.unfinish  = data.page.total - data.page.finish;
            data.period_chosen = qdmap[data.timeblock];
            console.log(data);
            var page_type = t.$el.find(".js-dropdown").find("option:selected").text();
            data.page.type = page_type?page_type: '全部';
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			Jser.loadimages(t.$el);
			t.$el.find(".js-dropdown").change(function() {
				var $elem = $(this).find("option:selected");
				t.doDropdown($elem.attr("data-type"));
				return false;
			});

			t.$el.find(".js-dropdown3").change(function() {
				if (!App.isLogin()) {
					return false;
				}
				var $elem = $(this).find("option:selected");
				var type = $elem.attr("data-type");
				t.doDropdown3(type);
				$elem.parent().html($elem.parent().html());
				// t.$el.find(".js-dropdown3 option").eq(-1).attr("selected", true);
				return false;
			});
		},
//		doLeft: function() {
//			var t = this;
//			var idx = Number(t.idx);
//			idx--;
//			if (idx < 1) {
//				idx = "11";
//			}
//			t.changePars({
//				"ptmin": qdmap[idx][0],
//				"ptmax": qdmap[idx][1],
//				"idx": idx
//			});
//			global_qd_type = 0;
//		},
//		doRight: function() {
//			var t = this;
//			var idx = Number(t.idx);
//			idx++;
//			if (idx > 11) {
//				idx = "1";
//			}
//			t.changePars({
//				"ptmin": qdmap[idx][0],
//				"ptmax": qdmap[idx][1],
//				"idx": idx
//			});
//			global_qd_type = 0;
//		},
		syncRender: function() {
			var t = this,
				data = t.model.toJSON();
			t.isLoad = false;
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-qingdan-list").append(_html);
			Jser.loadimages(t.$el);
		},
		doSwitchQingdan: function(e) {
			// var t = this;
			// var $elm = $(e.currentTarget);
			// var type = $elm.attr("data-type");


		},
		doCheckdQingdan: function(e) {
			var $elm = $(e.currentTarget);
            var type = $elm.attr("data-type");
			var ptid = $elm.attr("data-ptid");
			var name = $elm.attr("data-name");
			if (!$elm.hasClass("js-del")) {
				$elm = $elm.parent();
				var _data = {
						"id": ptid
					},
					url = "category/updateCategory";
                    _data.type = type;
                    _data.status = 1;
				if ($elm.hasClass("on")) {
					url = "category/updateCategory";
                    _data.status = 0;
				}
				$elm.toggleClass("on");
				Jser.getJSON(ST.PATH.ACTION + url, _data, function(data) {

				}, function() {
					$elm.toggleClass("on");
				}, "get");
			} else{
					Jser.confirm("确定要删除这件商品吗？", function() {
						var _data = {
								"id": ptid
							},
							url = "category/delMyCategory";
						Jser.getJSON(ST.PATH.ACTION + url, _data, function(data) {
							$elm.parent().remove();
                            var page_size = $('.page-size').text();
                            page_size = page_size?Number(page_size): 0;
                            if(page_size)$('.page-size').text(page_size - 1);
						}, function() {

						}, "get");
					});
			}
		},
        doSetPeriod: function(type){
           location.href = "/webapp/period.html"
        },
		doDropdown: function(type) {
			var t = this;
			window.global_qd_type = type;
            console.log(window.global_qd_type);
			t.model.fetchData();
		},
		doDropdown3: function(type) {
			var t = this;

			if (type == 1) {
				Jser.confirm('<div class="qingdan-add"><input type="text" id="js-qingdan-add-name" placeholder="请输入需要添加的商品名称"/></div>', function() {
					var name = $.trim($("#js-qingdan-add-name").val()),
						_html;
					if (name.length != 0) {
						var _data = {
								"name": name
							},
							url = "category/addMyCategory?timestamp=1437323557043&version=1.0&client=H5";
						Jser.getJSON(ST.PATH.ACTION + url, _data, function(data) {
							// $elm.parent().remove();

							_html = '<li class="clean product js-product">' + '<div class="qd-left">' + '<p class="qd-title">' + name + '</p>' + '</div>' + '<div class="qd-right js-qd-checked" data-name="' + name + '"><div class="qd-icon del"><i class="icon"></i><i class="del-icon"></i></div></div>' + '</li>'
                            var page_size = $('.page-size').text();
                            page_size = page_size?Number(page_size): 0;
                            $('.page-size').text(page_size + 1);
							t.$el.find(".js-qingdan-list").append(_html);
						}, function() {

						}, "post");
					}
				});
				t.$el.find(".js-product").removeClass("on2");
                t.$el.find(".js-product .js-qd-checked").removeClass("js-del");
                t.$el.find(".js-product .icon").show();
				//增加商品
			} else if (type == 2) {
				//删除商品
				t.$el.find(".js-product").addClass("on2").removeClass("");
                t.$el.find(".js-product .js-qd-checked").addClass("js-del");
                t.$el.find(".js-product .icon").hide();
			} else {
				t.$el.find(".js-product").removeClass("on2");
                t.$el.find(".js-product .js-qd-checked").removeClass("js-del");
                t.$el.find(".js-product .icon").show();
			}
		},
		bindEvent: function() {
			var t = this;
			t.finishScroll();
			$(window).off("scroll.qingdan").on("scroll.qingdan", t.doScroll);
		},
		doScroll: function() {
			var t = indexSelf,
				hash = window.location.hash;
			if (!t.iTimer && !t.isLoad && hash.indexOf("#qingdan/index") != -1) {
				t.iTimer = setTimeout(function() {
					var size = Jser.documentSize();
					if (size.fullHeight - size.scrollTop - size.viewHeight < 20) {
						t.loadData();
					}
					t.clearTime();
				}, 200);
			}
		},
		loadData: function() {
			var t = this;
			t.page++;
			if (t.page <= t.totalPage) {
				var pars = {
					"pageNo": t.page
				};
				t.isLoad = true;
				t.$el.find(".js-list-loading").show();
				t.changePars(pars);
			} else {
				t.finishScroll();
			}
		},
		clearTime: function() {
			var t = this;
			if (t.iTimer) {
				clearTimeout(t.iTimer);
			}
			t.iTimer = null;
		},
		finishScroll: function() {
			var t = this;
			t.$el.find(".js-list-loading").hide();
			$(window).off('scroll.qingdan', t.doScroll);
			t.clearTime();
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
//				"user_id": Jser.getItem('user_id'),
//				"ptmin": qdmap[_index][0],
//				"ptmax": qdmap[_index][1]
//				"idx": pars.idx
                timeblock: pars.idx
			}
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});