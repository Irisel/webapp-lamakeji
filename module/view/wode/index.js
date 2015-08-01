define('', '', function(require) {
	var B = require('backbone');
	var M = require('base/model');
	var H = require('text!../../../tpl/wode/index.html');
	var model = new M({
        logged: !!Jser.getItem('phone'),
        pars: {
//	        "user_id": Jser.getItem("user_id")
            "mock": true
		}
	});
	var V = B.View.extend({
		model: model,
		template: H,
		events: {
			"click .js-sure": "doSure",
            "click .js-logout": "doLogout"
		},
		initialize: function() {
			var t = this;
			t.listenTo(t.model, "sync", function() {
				t.render();
			});
		},
		//待优化
		render: function() {
            var status = {
                'born': '已出生',
                'during': '怀孕中',
                'prepare': '备孕中',
                'wondering': '随便逛逛'
            };
            var gender = {
                'female': '女',
                'male': '男'
            };
            var qdmap = {
		      prepare: [1,1],
		      during: [2,4],
		      born: [5, 11],
		      wondering: [0, 0]
	        };
			var t = this,
				data = t.model.toJSON();
            if(data.data && data.data.phone){
                Jser.setItem('phone', data.data.phone);
                var user_status = '';
                var lama_json = {};
                var timeblock = Number(data.data.timeblock);
                $.each(qdmap, function(key, value){
                    if(timeblock >= value[0] && timeblock <= value[1]){
                        user_status = key;
                        lama_json.xinxistatus = user_status;
                    }
                });
                if(user_status == 'born' || user_status == 'during')data.data.moreInfo = true;
                if(user_status == 'born'){
                    data.data.data_type = '宝宝生日';
                    data.data.showGender = data.data.sex == '1'?'女孩':'男孩';
                }else if(user_status == 'during'){
                    data.data.data_type = '预产期';
                }
                lama_json.xinxichoosen = data.data.birthday;
                lama_json.xinxigender = data.data.sex == '1'?'female':'male';
                lama_json.signed = true;
                Jser.setItem('lama', JSON.stringify(lama_json));
                data.data.xinxichoosen = data.data.birthday;
                data.data.showStatus = status[user_status];
            }
            else if(window.localStorage){
                data.data = {};
                data.pars = {
                    phone: Jser.getItem('phone')
                };
                var lama = Jser.getItem('lama');
                if(lama){
                    lama = JSON.parse(lama);
                    if(lama.xinxistatus == 'during' || lama.xinxistatus == 'born'){
                        lama.moreInfo = true;
                        lama.data_type = (lama.xinxistatus == 'during')?'预产期':'宝宝生日';
                    }

                    lama.showStatus = status[lama.xinxistatus]?status[lama.xinxistatus]: '随便逛逛';
                    if(lama.xinxistatus == 'born')lama.showGender = gender[lama.xinxigender];
                    data.data = lama;
                }
            }
			var html = _.template(t.template, data);
			t.$el.show().html(html);
			t.bindEvent();
			if (!App.isLogin()) {
				return false;
			}
		},
        doLogout: function(){
            Jser.getJSON(ST.PATH.ACTION + "user/logout?timestamp=1437323952097&iTime=1437323952097&version=1.0&client=H5", {}, function(data) {
                    Jser.alert("登出成功", function() {
                        Jser.setItem('phone', "");
					    Jser.setItem("password", "");
                        Jser.setItem("sex", "");
					    Jser.setItem("timeblock", 0);
                        Jser.setItem("birthday", "");
                        Jser.setItem('lama', JSON.stringify({}));
//                        window.location.reload();
                        window.location.href = '#login/index';
                    });
				}, function() {
                   Jser.alert("网络错误", function() {
                        window.location.reload();
                   });
		    }, "post");

        },
		changePars: function(pars) {
			var t = this;
			var data = $.extend({}, t.model.get("pars"));
			$.extend(data, pars);
			t.model.set("pars", data);
			t.model.fetchData();
		},
		bindEvent: function() {
			var t = this;
			t.$el.find(".js-name").blur(function() {

			}).focus(function() {
				t.$el.find(".js-sure").show();
			});
		},
		doSure: function(e) {
			if (!App.isLogin()) {
				return false;
			}
			var t = this;
			var $elem = $(e.currentTarget);
			if ($elem.hasClass("modified")) {
				$elem.removeClass("modified").text("保存");
				t.$el.find(".js-name").removeAttr("disabled").focus();
			} else {
				var v1 = $.trim(t.$el.find(".js-name").val());
				if (v1.length != 0) {
					var _data = {
						"babynickname": v1,
						"user_id": Jser.getItem("user_id")
					};
					Jser.getJSON(ST.PATH.ACTION + "user/perfectUserInfo", _data, function(data) {
						// Jser.alert(data.msg);
						$elem.addClass("modified").text("修改");
						t.$el.find(".js-name").attr("disabled", true).blur();
					}, function() {

					}, "post");
				} else {
					Jser.alert("请输入宝宝昵称");
				}
			}

		}
	});
	return function(pars) {
		model.set({
			action: '/user/login?timestamp=1437323557043&version=1.0&client=H5',
            type: 'post',
            pars: {
//			    "user_id": Jser.getItem("user_id")
                "phone": Jser.getItem('phone'),
                "password": Jser.getItem('password'),
                "mock": true
		    }
		});
		return new V({
			el: $("#" + pars.model + "_" + pars.action)
		});
	}
});