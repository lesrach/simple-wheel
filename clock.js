(function(factory){
	if(typeof define === "function" && define.amd ){
		define(factory);
	} else{
		factory();
	}
}(function(){
	// 参数说明：
	// 	canvas：待绘制的canvas元素。
	// 	options：
	// 		left: 相对于画布的左偏移
	// 		top：相对于画布的上偏移
	// 		r：数字小球的半径
	// 		isShow：true为显示时间，false为倒计时，该选项为false时endTime必填
	// 		endTime：倒计时结束时间 需要的格式为new Date();
	// 		ballColor：小球颜色
	//      matrix: 数字矩阵
	function Clock(canvas,options){
		options = options || {};
		this.container = canvas;
		this.context = this.container.getContext? this.container.getContext("2d"): null;
		this.left = options.left || 50;
		this.top = options.top || 50;
		this.r = options.r || 7;
		this.isShow = options.isShow || true;
		this.endTime = options.endTime ;
		this.ballColor = options.ballColor || "#ff6700";
		this.matrix = options.matrix;
		this.balls = [];
		this.h = null;
		this.m = null;
		this.s = null;
		this.init();
	}
	Clock.prototype = {
		constructor: Clock,
		init: function(){
			if(this.context ==null){
				throw error = "arguments 1 need a canvas element";
			}
			var t = new Date();
				this.h = t.getHours(),
				this.m = t.getMinutes(),
				this.s = t.getSeconds();
			var up = this.updata.bind(this);
			setInterval(up,1000/60);
		},
		updata:function(){
			this.context.clearRect(0,0,this.container.width,this.container.height);
			if(this.isShow){
				var	t = new Date(),
					h = t.getHours(),
					m = t.getMinutes(),
					s = t.getSeconds();
			} else{
				var t = new Date(),
					other = parseInt((t.getTime() - this.endTime.getTime())/1000);
					s = other%60;
					m = parseInt(other/60)%60;
					h = totwo(parseInt(other/3600));
			} //获取待处理的时间数据
			this.draw.call(this,parseInt(h/10),this.left,this.top,this.context);
			this.draw.call(this,parseInt(h%10),this.left+15*(this.r+1),this.top,this.context);
			this.draw.call(this,10,this.left+30*(this.r+1),this.top,this.context);
			this.draw.call(this,parseInt(m/10),this.left+39*(this.r+1),this.top,this.context);
			this.draw.call(this,parseInt(m%10),this.left+54*(this.r+1),this.top,this.context);
			this.draw.call(this,10,this.left+69*(this.r+1),this.top,this.context);
			this.draw.call(this,parseInt(s/10),this.left+78*(this.r+1),this.top,this.context);
			this.draw.call(this,parseInt(s%10),this.left+93*(this.r+1),this.top,this.context); 
			//时间显示渲染
			for(let i=this.balls.length-1;i>=0;i--){
				if(this.balls.length == 0){
					break;
				}
				this.balls[i].x += this.balls[i].vx;
				this.balls[i].y += this.balls[i].vy;
				this.balls[i].vy += this.balls[i].g;
				if(this.balls[i].y>this.container.height-this.r){
					this.balls[i].vy = -this.balls[i].vy*0.6;
				} //弹跳一次速度减慢
				if(this.balls[i].y>this.container.height-this.r-3 && Math.abs(this.balls[i].vy)<0.5){
					this.balls[i].vy = 0;
					this.balls[i].y = this.container.height-this.r;
				} //弹跳到一定速度不再弹跳
				this.balls[i].draw();
				if(this.balls[i].x< -this.balls[i].r*2 || this.balls[i].x > this.container.width+this.balls[i].r*2){
					this.balls.splice(i,1);
				} //出届球删除

			}
			if(this.s != s){
				this.addBall.call(this,parseInt(s%10),this.left+93*(this.r+1),this.top,this.context);
				if(parseInt(this.s/10)!=parseInt(s/10)){
					this.addBall.call(this,parseInt(s/10),this.left+78*(this.r+1),this.top,this.context);
				}
			}
			if(this.m != m){
				this.addBall.call(this,parseInt(m%10),this.left+54*(this.r+1),this.top,this.context);
				if(parseInt(this.m/10)!=parseInt(m/10)){
					{
						this.addBall.call(this,parseInt(m/10),this.left+39*(this.r+1),this.top,this.context);
					}
				}
			}
			if(this.h != h){
				this.addBall.call(this,parseInt(m%10),this.left+54*(this.r+1),this.top,this.context);
				if(parseInt(this.h/10)!=parseInt(h/10)){
					{
						this.addBall.call(this,parseInt(m/10),this.left+39*(this.r+1),this.top,this.context);
					}
				}
			}
			this.s= s;
			this.m= m;
			this.h= h;
		},
		totwo: function(str){
			str = str.toString();
			if(str.length>2){
				return "99" ;
			} else{
				return str;
			}
		}, //倒计时小时上限设为99
		draw: function(num,x,y,ctx){
			this.context.fillStyle = this.ballColor;
			for(let i=0;i<this.matrix[num].length;i++){
				for(let j=0;j<this.matrix[num][i].length;j++){
					if(this.matrix[num][i][j] == 1 ){
						this.context.beginPath();
						this.context.arc(x+(j*2+1)*(this.r+1),y+(i*2+1)*(this.r+1),this.r,0,2*Math.PI);
						this.context.closePath();
						this.context.fill();
					}
				}
			}
		},
		addBall: function(num,x,y){
			for(let i=0;i<this.matrix[num].length;i++){
				for(let j=0;j<this.matrix[num][i].length;j++){
					if(this.matrix[num][i][j] == 1 ){
						var ball = new Ball(x+(j*2+1)*(this.r+1),y+(i*2+1)*(this.r+1),this.r,this.context);
						this.balls.push(ball);
					}
				}
			}
		}
	}
	function Ball(x,y,r,ctx,vx,vy,g,color){
		this.x = x;
		this.y = y;
		this.r = r;
		this.context = ctx;
		this.g = (parseInt(Math.random()*10+10))/10;
		this.vx = (Math.random()*2+2)*Math.pow(-1,parseInt(Math.random()*100));
		this.vy = parseInt(-10 * Math.random());
		this.color = this.getColor();
	}
	Ball.prototype = {
		constructor: Ball,
		draw: function(){
			this.context.fillStyle=this.color;
			this.context.beginPath();
			this.context.arc(this.x+this.r+1,this.y+this.r+1,this.r,0,2*Math.PI);
			this.context.closePath();
			this.context.fill();
		},
		getColor: function(){
			var num = (parseInt(Math.random()*0xffffff)).toString(16);
			while(num.length<6){
				num = "0"+num;
			}
			num = "#"+num;
			return num;
		}
	}
	window.Clock = Clock;
	window.Ball = Ball;
}));