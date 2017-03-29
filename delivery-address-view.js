 define(function(require, exports, module){
		var cPlugins = require('cPlugins'); // 引用公用插件库
		var deliveryAddress = require('deliveryAddress');
		var jsAddress = require('jsAddress');

		ajaxAddress();
		
		/**
		 * 刷新收货地址
		 */
		function ajaxAddress(){
			$.ajax({  
		        type : "POST",  
		        async : false,  //同步请求  
		        url : ctx+"/receiver/findReceiverList",  
		        timeout:1000,  
		        success:function(datas){
		        	isCreate(datas.data.length);//添加是否可创建收货信息
		        	receiverList(datas.data);
		        },  
		        error: function() {  
		        }  
		    });  
		}
		
		function isCreate(size){
			var mes = '<span class="title fl">收货地址</span>';
			mes += '<span class="info fl">已创建'+size+'个收货地址，最多可创建3个</span>';
			if(size<3){
				mes += '<button class="btn btn-green btn-newaddr fl ml-20" type="button">新增收货地址</button>';
			}
			$(".address-info").html(mes);
		}
		
		function receiverList(data){
			var myAddrData = new Array();
			$.each(data, function(i, item){
				var json = {
					addrId:item.id,
					addrName:item.receiver,
					addrProvince:item.province,
					addrArea:item.province + ' ' + item.city + ' ' + item.county,
					addrDetail:item.detailAddress,
					addrPhone:item.phone,
					addrTel:item.tel,
					isDefault:item.isDefault
				};
				myAddrData.push(json);
			});
			$('.address-list').empty().loopMyAddr(myAddrData);//要刷新的div 
		}

		$('.dropdown-h').dropdown(); // 顶部快捷菜单栏dropdown效果

		//新增地址 弹出框
		$('.delivery-address').on('click','.btn-newaddr',function() {
			$(this).showPopup('#popup-newaddr');
			$("#id").val('');
			$("#isDefault").val('');
			$("#receiver").val('');
			$("#detailAddress").val('');
			$("#phone").val('');
			$("#tel").val('');
			$("#province").val('');
			$("#city").val('');
			$("#county").val('');
			addressInit(ctx,'selProvince', 'selCity', 'selDistrict', '','', '','province', 'city', 'county');//初始化地址
		});
		//修改地址 弹出框
		$('.delivery-address').on('click','.btn-edit',function() {
			var id = $(this).parents(".panel").attr("address-id");
			var url = ctx + "/receiver/findById";
			$.ajax({
				type : "POST",
				async : false,
				url : url,
				data : {
					id : id,
				},
				timeout : 1000,
				success : function(data) {
					if(data.isSuccess){
						var obj = data.data;
						$("#id").val(obj.id);
						$("#isDefault").val(obj.isDefault);
						$("#receiver").val(obj.receiver);
						$("#detailAddress").val(obj.detailAddress);
						$("#phone").val(obj.phone);
						$("#tel").val(obj.tel);

						$("#province").val(obj.province);
						$("#city").val(obj.city);
						$("#county").val(obj.county);
						addressInit(ctx,'selProvince', 'selCity', 'selDistrict', obj.provinceCode, obj.cityCode, obj.countyCode, 'province', 'city', 'county');//初始化地址
					}
				},
				error : function() {
					alert("设置失败!");
				}
			});
			
			$(this).showPopup('#popup-newaddr');
		});
		
		$('#addModelClose').on('click',function() {
			$('#w-popup-data').find('.btn-close').trigger('click');
		});
});

function closeAddModel(){
	$('#w-popup-data').find('.btn-close').trigger('click');
}

function submitAddForm(){
	if($("#receiver").val() == '' || $("#receiver").val() == null){
		alert("收货人不能为空!");
		return false;
	}
	if($("#province").val() == '' || $("#city").val() == '' || $("#county").val() == ''){
		alert("请选择地区!");
		return false;
	}
	if($("#detailAddress").val() == '' || $("#detailAddress").val() == null){
		alert("地址不能为空!");
		return false;
	}
	if($("#phone").val() == '' || $("#phone").val() == null){
		alert("手机号码不能为空!");
		return false;
	}
	var myreg = /^1[34578]\d{9}$/;
	if(!myreg.test($("#phone").val())) {
	    alert('请输入有效的手机号码！'); 
	    return false; 
	}
	
	var id = $("#id").val();
	var url =ctx+"/receiver/saveReceiver";
	if(id !=''){
		url=ctx+"/receiver/updateReceiver";
	}
	// 验证通过
    $.post(url, $('#form-add').serialize(), function(response) {
        if(response.isSuccess){
        	closeAddModel();
        	window.location.reload();
        }
    });
}

function deleteById(id) {
	if (confirm("确认要删除？")) {
		var url = ctx + "/receiver/deleteReceiver";
		$.ajax({
			type : "POST",
			async : false,
			url : url,
			data : {
				id : id,
			},
			timeout : 1000,
			success : function(data) {
				window.location.reload();
			},
			error : function() {
				alert("删除失败!");
			}
		});
	}
}

function setDefault(id){
	var url = ctx + "/receiver/setDefaultById";
	$.ajax({
		type : "POST",
		async : false,
		url : url,
		data : {
			id : id,
		},
		timeout : 1000,
		success : function(data) {
			window.location.reload();
		},
		error : function() {
			alert("设置失败!");
		}
	});
}