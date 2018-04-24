/**
 * 参数说明：
 * 1.URL  必填
 * 2.config (选填项，各种参数的配置)
 *          2.1 type  默认post
 *          2.2 async 默认 true 
 *          2.3 cache 默认false 
 *          2.4 dataType 默认json
 *          2.5 contentType 默认utf-8
 *          2.6 data  默认无参数，此处一般需要使用者手动添加
 *          2.7 packRemindType 有layer插件时有限layer提示，否则为console。log提示“console” 控制台提示；‘layer',layer 提示，其他方式看需求增加，仅在函数值无效时有效
 * 3. func_suc(选填)  ajax success
 * 4. func_error     ajax  error 
 * 5. func_comp      ajax  complete
 * 其他说明：
 * 1.防止重复提交，自动启动，但在同步加载模式下看不出效果
 * 2.提示模式，参考packRemindType
 */

 function ajax_pack (url,config,func_suc,func_error,func_comp) {  
    //1.request  
    if (!window.lstAjaxUrl) {
        window.lstAjaxUrl = {};
    };
    if (window.lstAjaxUrl[url]){
        console.log('ajax (url:%s) submit repeat!',url);
        return ;
    }else{
        window.lstAjaxUrl[url] = true;
    }
    //2 init 
    config = config || {};
    config.type = config.type || 'post';
    config.async = config.async || true;
    config.cache = congif.cache || false;
    config.dataType = config.dataType || 'json';
    config.contentType = config.contentType || 'application/x-www-form-urlencoded; charset=utf-8';
    config.data =config.data|| {};

    var packRemindTypeDefault = typeof(layer) === 'undefined'?'console':'layer';
    config.packRemindTypeDefault = config.packRemindType||packRemindTypeDefault;

    var func_send;
    
    if (config.packRemindType === "console") {
        func_send = function () {  };
        func_suc= func_suc||function (data) {  console.log(data);};
        func_error = func_error || function () {  } ;
        func_comp = func_comp || function () {  };
    }else if (config.packRemindType === 'layer'){
        if (!window.lstLayerLoad) {
            window.lstLayerLoad = {};

        };
        func_send = function () {  
            window.lstLayerLoad[url] = layer.msg('加载中。。。',{time:0});
        };
        var func_suc_init = func_suc || function (data) {  
            if (data.success ==1) {
                layer.msg(data.message,{icon:1});
            }else{
                layer.msg(data.message,{icon:2});
            };
        };
        func_suc =  function (data) {  
            layer.close(window.lstLayerLoad[url])
            func_suc_init(data);
        };
        var func_error_init = func_error || function () {  
            layer.msg('网络错误，请稍后重试',{icon:2});
        };
        func_error=function(){
			layer.close(window.lstLayerLoad[url]);
			func_error_init();
        };
        func_comp = func_comp || function () {  };
    }else{
        console.log('nonsuppoet packRemindType');
        return;
    };
    // 3.get 
    $.ajax({
        url:url,
		type:config.type,
		async:config.async,
		cache:config.cache,
		dataType:config.dataType,
		contentType:config.contentType,
        data:config.data,
        beforeSend:function () {  
            func_send();
        },
        success:function () {  
            if(!window.lstAjaxResult){
				window.lstAjaxResult={};
			}
			window.lstAjaxResult[url]=data;//封装结果
			func_suc(data);
        },
        error:function () {  
            func_error();
        },
        complete:function (data) {  
            func_comp();
            window.lstAjaxUrl[url] = false;

        }
    });
    
 };





