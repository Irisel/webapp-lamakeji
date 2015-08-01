define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/list/index.html');
	var list_tpl = require('text!../../../tpl/list/view/list.html');
	var model = new M({
		action: 'favorite/getDetail'
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-back": "goback",
			"click .js-share": "doShare",
            "click .js-mark": "doMark"
		},
        refresh: 0,
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
            t.refresh_on = null;
            t.refresh_off = null;
            if(data.data.name){
                data.data.name = data.data.name.length>7?(data.data.name.substr(0, 7)+ '...'): data.data.name;
            }
            data.data.on = t.model.get("pars")["on"];
            data.product = data.data.product;
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			var _html = _.template(list_tpl, data);
			t.$el.find(".js-list-area").append(_html);
			Jser.loadimages(t.$el.find(".js-list-area"));
			t.setShare();
//            Jser.getJSON("http://www.lamakeji.com/mamago/index.php/favorite/getDetail?favoriteId="+ data.data.fid,"", function(data) {
                t.$el.find('.strategy-share').html(data.data.h5content);
//            })
            alert('working');
            var _height = $('#list_index').height();
            t.$el.find('.list-wrapper').height(_height - 94).css('overflow', 'scroll');
		},
		goback: function() {
            var t = this;
            var refresh = '/';
            if(t.refresh_on){
                refresh+= 'refresh_on:' + t.refresh_on;
            }else if(t.refresh_off){
                refresh+= 'refresh_off:' + t.refresh_off;
            }
			window.location.href = 'http://www.lamakeji.com/webapp/#index/index' + refresh;
		},
		doMark: function(e) {
            var t = this;
			if (!App.isLogin()) {
				return false;
			}
            event.stopPropagation();
			var $elem = $(e.currentTarget);
			var on = Number($elem.attr("data-on"));
            var _data = {id: $elem.attr("data-fid")};
			if (on) {
//                if($elem.data('userid') == '1'){
//                    Jser.alert("默认的心愿单不能取消关注");
//                    event.preventDefault();
//                    return;
//                }
				Jser.confirm("确定要取消关注么？", function() {
				    Jser.getJSON(ST.PATH.ACTION + "favorite/delFavorite", _data, function(data) {
					    $elem.removeClass('icon-heart-on');
                        $elem.attr("data-on", 0);
                        t.refresh_off = _data.fid;
                        t.refresh_on = null;
				});
			});
			} else {
				/*
				fname:收藏夹名称
				fdescribe:收藏夹描述
				user_id：所有者用户主键
				owner:0：未公开    1：公开
				father_id:
				 */
				var url = "favorite/addFavorite";
				Jser.getJSON(ST.PATH.ACTION + url, _data, function(data) {
                    $elem.addClass('icon-heart-on');
                    $elem.data('fid', data.id);
					Jser.alert("已成功添加到我的关注");
                    t.refresh_off = null;
                    t.refresh_on = _data.id;
				}, function() {

				});

				$elem.attr("data-on", "1");

			}
			return false;
		},
		setShare: function() {
            loadwxconfig();
			var t = this;
			var fid = t.model.get("pars")["id"];
			var descContent = "推荐妈咪手袋 ：" + (Jser.getItem("fdescribe" + fid) || "辣妈科技");
			var shareTitle = Jser.getItem("fdescribe" + fid) || "辣妈科技";
            var imgUrl = Jser.getItem("fpicture" + fid);
			var url = 'http://www.lamakeji.com/webapp/#list/share/fid:'+ fid +'?share=true';
            var weixin_share = {
				lineLink: url,
				shareTitle: shareTitle,
				descContent: descContent
			};
            if(imgUrl)weixin_share.imgUrl = imgUrl;
			Jser.setshare(weixin_share);
		},
		doShare: function() {
			Jser.share();
		},
		changePars: function(pars) {
			var t = this;
			t.model.set("pars", pars);
		}
	});

	return function(pars) {
		if (pars.guanzhu) {
			model.set({
				pars: {
					"id": pars.id,
                    "expand": "product",
					"guanzhu": pars.guanzhu,
                    "on": pars.on
				}
			});
		} else if (pars.id) {
			model.set({
				pars: {
					"id": pars.id,
                    "expand": "product",
                    "on": pars.on
				}
			});
		}
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});