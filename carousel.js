/* 淡入淡出轮播（基于tools.js）
options = {
	imgs : [
		{src:"1.jpg", href:""},
		{src:"2.jpg", href:""},
		{src:"3.jpg", href:""}
	]
	width :
	height:
	container:
}
*/

function CarouselOI(options) {
	options = options || {};
	this.imgs = options.imgs;
	this.container = options.container;
	this.width = options.width;
	this.height = options.height;
	this.imgBoxes = []; // 存放所有 li 的元素
	this.circles = null; // 存放所有小圆点的元素
	this.currentIndex = 0;
	this.nextIndex = 1;
	this.timer = null; // 计时器id

	this.init();
}

CarouselOI.prototype = {
	constructor : CarouselOI,
	init : function(){
		/* 创建轮播图外层的节点 */
		var _container = document.createElement("div");
		_container.className = "carousel_container";
		// 设置 _container 样式
		css(_container, {
			width : this.width + "px",
			height : this.height + "px"
		})
		/* 放置轮播图片的 ul */
		var _ul = document.createElement("ul");
		// 设置 _ul样式
		css(_ul, {
			width : this.width + "px",
			height : this.height + "px"
		});
		// 创建 li
		for (var i = 0, len = this.imgs.length; i < len; i++) {
			var _img = this.imgs[i];
				_li = document.createElement("li");
			_li.innerHTML = "<a href='"+ _img.href +"' target='_blank'><img src='"+ _img.src +"'></a>";
			if (i === 0) 
				show(_li);
			_ul.appendChild(_li);
			// 将当前创建 li 元素保存到 imgBoxes 数组中
			this.imgBoxes.push(_li);
		}
		_container.appendChild(_ul);
		/* 小圆点 */
		var _pages = document.createElement("div");
		_pages.className = "pages";
		css(_pages, {width:this.width+"px"});
		for (var i = 0; i < len; i++) {
			_pages.innerHTML += "<div class='"+ (i===0?"current":"") +"'></div>";
		}
		this.circles = $("div", _pages); // 保存所有小圆点到对象属性中
		_container.appendChild(_pages);
		/* 上一页、下一页  (在总宽度小于300时去除此功能) */
		if(this.width > 300){
			var _prev = document.createElement("div");
			_prev.className = "prev";
			_prev.innerText = "<";
			var _next = document.createElement("div");
			_next.className = "next";
			_next.innerText = ">";
			_container.appendChild(_prev);
			_container.appendChild(_next);

		}
		
		/* 将当前轮播图的布局结构添加到页面容器中 */
		this.container.appendChild(_container);

		/* 自动轮播 */
		var cb = this.move.bind(this);
		this.timer = setInterval(cb, 3000);

		/* 移入/移出容器，停止/启动自动轮播 */
		on(_container, "mouseenter", ()=>{
			this.over();
		});
		on(_container, "mouseleave", ()=>{
			this.out();
		});
		/* 小圆点切换，事件委派 */
		on(_pages, "click", (e) => {
			e = e || event;
			// 获取事件源对象
			var src = e.target || e.srcElement;
			// 判断
			if (src !== _pages) {
				// 获取当前点击小圆点的索引
				var index = inArray(src, Array.from(this.circles))
				if (this.currentIndex !== index) {
					this.nextIndex = index;
					this.move();
				}
			}
		});
		/* 上/下一页切换 (宽度大于300生效)*/
		if(this.width>300){
			on(_prev, "click", () => {
				this.nextIndex = this.currentIndex - 1;
				if (this.nextIndex < 0)
					this.nextIndex = this.imgBoxes.length - 1;
				this.move();
			});
			on(_next, "click", () => {
				this.move();
			});
		}
	},
	move : function(){ // 轮播切换的函数
		// 当前显示图片淡出
		fadeOut(this.imgBoxes[this.currentIndex], 600);
		// 即将显示图片淡入
		fadeIn(this.imgBoxes[this.nextIndex], 600);
		// 当前显示红色背景样式小圆点去掉样式
		this.circles[this.currentIndex].className = "";
		// 即将显示红色背景样式小圆点设置样式
		this.circles[this.nextIndex].className = "current";

		// 修改currentIndex与nextIndex的值
		this.currentIndex = this.nextIndex;
		this.nextIndex++;
		if (this.nextIndex >= this.imgBoxes.length)
			this.nextIndex = 0;
	},
	over : function(){
		clearInterval(this.timer);
	},
	out : function(){
		this.timer = setInterval(this.move.bind(this), 3000);
	}
}

/*无缝滚动轮播（基于tools.js）
options{
	imgs：[
		{src:"1.jpg",href:"www.baidu.com"},
		{src:"1.jpg",href:"www.baidu.com"},
		{src:"1.jpg",href:"www.baidu.com"}
	]
	width:
	height:
	container:
}
*/

function CarouselLR(options){
	this.imgs = options.imgs;
	this.container = options.container;
	this.width = options.width;
	this.height = options.height;
	this.imgBoxes = null; // 存放所有 li 的元素的盒子
	this.circles = null; // 存放所有小圆点的元素
	this.currentIndex = 0;
	this.nextIndex = 1;
	this.timer = null; // 计时器id
	this.turn = true; // 开关，防止点击过快
	this.init();
}

CarouselLR.prototype = {
	constuctor : CarouselLR,
	init : function(){
		/* 创建轮播图外层的节点 */
		var _container = this.imgBoxes = document.createElement("div");
		_container.className = "carouselLR_container";
		// 设置 _container 样式
		css(_container, {
			width : this.width * (this.imgs.length+2) + "px",
			height : this.height + "px",
			position:"absolute",
			top: 0,
			left: - this.width + "px"
		})
		/* 放置轮播图片的 ul */
		var _ul = document.createElement("ul");
		// 设置 _ul样式
		css(_ul, {
			width : "100%",
			height : "100%"
		});
		// 创建 li
		for (var i = 0, len = this.imgs.length ; i < len; i++) {
			var _img = this.imgs[i];
				_li = document.createElement("li");
			_li.innerHTML = "<a href='"+ _img.href +"' target='_blank'><img src='"+ _img.src +"'></a>";
			_ul.appendChild(_li);
		}
		_container.appendChild(_ul);
// 前后添加无缝图片
// 前添加
		var fimg = this.imgs[this.imgs.length-1],
			_li = document.createElement("li");
		_li.innerHTML = "<a href='"+ fimg.href +"' target='_blank'><img src='"+ fimg.src +"'></a>";
		_ul.insertBefore(_li,$("li",_ul)[0]);
// 前添加
		var limg = this.imgs[0],
			_li = document.createElement("li");
		_li.innerHTML = "<a href='"+ limg.href +"' target='_blank'><img src='"+ limg.src +"'></a>";
		_ul.appendChild(_li);
		
/* 将当前轮播图的布局结构添加到页面容器中 */
		css(this.container,{
			overflow : "hidden",
			width: this.width + "px",
			height : this.height +  "px",
			position:"relative"
		})
		this.container.appendChild(_container);
/* 小圆点 */
		var _pages = document.createElement("div");
		_pages.className = "pages";
		css(_pages, {width:this.width+"px",zIndex:"3"});
		for (var i = 0; i < len; i++) {
			_pages.innerHTML += "<div class='"+ (i===0?"current":"") +"'></div>";
		}
		this.circles = $("div", _pages); // 保存所有小圆点到对象属性中
		this.container.appendChild(_pages);
		/* 上一页、下一页 */
		var _prev = document.createElement("div");
		_prev.className = "prev";
		_prev.innerText = "<";
		var _next = document.createElement("div");
		_next.className = "next";
		_next.innerText = ">";
		this.container.appendChild(_prev);
		this.container.appendChild(_next);


		/* 自动轮播 */
		var cb = this.move.bind(this);
		this.timer = setInterval(cb, 3000);

		/* 移入/移出容器，停止/启动自动轮播 */
		on(this.container, "mouseenter", ()=>{
			this.over();
		});
		on(this.container, "mouseleave", ()=>{
			this.out();
		});
		/* 小圆点切换，事件委派 */
		on(_pages, "click", (e) => {
			e = e || event;
			// 获取事件源对象
			var src = e.target || e.srcElement;
			// 判断
			if (src !== _pages&& this.turn == true) {
				// 获取当前点击小圆点的索引
				var index = inArray(src, Array.from(this.circles))
				if (this.currentIndex !== index) {
					this.nextIndex = index;
					this.move();
					this.turn = false;
				}
			}
		});
		/* 上/下一页切换 */
		on(_prev, "click", () => {
			if(this.turn == true){
				this.nextIndex = this.currentIndex - 1;
				this.move();
				this.turn = false;
			}
		});
		on(_next, "click", () => {
			if(this.turn == true){
				this.move();
				this.turn = false;
			}
		});
	},
	move : function(){ // 轮播切换的函数
		//图片往下一个坐标移动
		var _left = -1 * (this.nextIndex+1) * this.width ,
			len = this.imgs.length;
		// 当前显示红色背景样式小圆点去掉样式
		this.circles[(this.currentIndex+len)%len].className = "";
		// 即将显示红色背景样式小圆点设置样式
		this.circles[(this.nextIndex+len)%len].className = "current";
		// 修改currentIndex与nextIndex的值
		this.currentIndex = this.nextIndex;
		this.nextIndex++;
		var that = this;
		if (this.nextIndex > len){  //最后一张往第一张过渡
			animate(this.imgBoxes,{
				left : _left
			},1000,function(){
				css(that.imgBoxes,{left : - that.width + "px"});
				that.nextIndex = 1;
				that.currentIndex = 0;
				that.turn = true;
			})
			return;
		}
		if (this.nextIndex <= 0){	//第一张往最后一张过渡
			animate(this.imgBoxes,{
				left : _left
			},1000,function(){
				css(that.imgBoxes,{left : - len * that.width + "px"});
				that.nextIndex = len;
				that.currentIndex = len - 1;
				that.turn = true;
			})
			return;
		}
		animate(this.imgBoxes,{
			left : _left
		},1000,function(){
			that.turn = true ;
		})
		
	},
	over : function(){
		clearInterval(this.timer);
	},
	out : function(){
		this.timer = setInterval(this.move.bind(this), 3000);
	}
}
