/*
Array.prototype.shuffle = function(b){
	var i = this.length, j, t;
	while(i){
		j = Math.floor( ( i-- ) * Math.random() );
		t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
};
*/

		
/*
jQuery.preloadImages = function () {
	var images = (typeof arguments[0] == 'object') ? arguments[0] : arguments;
	for (var i = 0; i < images.length; i++) {
		jQuery("<img>").attr("src", images[i]);
	}
}
*/

/*
$.preloadImages(
	"./color0.png",
	"./color1.png",
	"./color2.png",
	"./colorl0.png",
	"./colorl1.png",
	"./colorl2.png"
);
*/
	
var lang = {}
var prefix = 'en';

var levels = [];

var RED    = 0,
	GREEN  = 1,
	BLUE   = 2,
	YELLOW = 3;

var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMESPACE;
var SIZES = {
//	column : 0,
	pointsbar : 80,
	margin : 10,// без масштабирования
	lamp :  80,
	lampmargin : 45,
	
	levelbar : {
		x : 15,
		y : 25
	},
	colors : {
		y : {
			x : 145,
			y : 25
		},
		b : {
			x : 190,
			y : 25
		},
		r : {
			x : 239,
			y : 25
		},
		g : {
			x : 285,
			y : 25
		}
	}
}
var Game = {
	help :
	"\ndebug_t - add ties\n" +
	"debug_v - add vertices\n" +
	"debug_p - patch _p<r,g,b,y>",
	cursor : 0,
//	width      		: 5,//9 | 7
//	height     		: 5,//6 | 9
//	colnum			: 5,
//	lampnum			: 10,
//		points     		: 0,
//		objectsnum 		: 6,//6
//		level			: 1,
//	maxlevelsnum	: 9, // mappoints.length
//	up				: false,
//		start			: 0,
//		finish			: 0,
//		stepstime		: 5,//5, in sec.
//		run				: false,
//	map : [],
	net : {
//		fillvertices : function(i){
//			for(var j = 0; j < i; j++){
//				this.net.vertices[j] = {
//					x : 0,
//					y : 0,
//					glow : false,
//					color : (Math.random() * Game.colorsnum)|0
//				}
//			}
//		},
//		tiesM : [//                  0  1  2  3  4  5
//			[ 0, 0, 0, 0, 0, 0 ],// 0 [  , 0, 0, 0, 0, 0 ] (x > y) ? hasties(x, y) : hasties(y, x)
//			[ 0, 0, 0, 0, 0, 0 ],// 1 [  ,  , 0, 0, 0, 0 ]
//			[ 0, 0, 0, 0, 0, 0 ],// 2 [  ,  ,  , 0, 0, 0 ]
//			[ 0, 0, 0, 0, 0, 0 ],// 3 [  ,  ,  ,  , 0, 0 ]
//			[ 0, 0, 0, 0, 0, 0 ],// 4 [  ,  ,  ,  ,  , 0 ]
//			[ 0, 0, 0, 0, 0, 0 ]//  5 [  ,  ,  ,  ,  ,   ]
//		],
		ties : [], // (*)***(*) // (*)---( ) // ( )---(*) // ( )---( )
		vertices : [],
		patchcount : {}
	},
//	randcolors : function(){
//	},
	hit : function(x, y){
		if(Game.debug_v){
			if(!Game.debug_vr){
				Game.net.vertices = [];
				Game.net.ties = [];
				Game.debug_vr = true;
			}
			$('#canvas').css('border', '1px solid #fff');
			if(Game.debug_va){} else {
				Game.debug_va = true;
				Game.net.vertices = []
				Game.net.ties = []
			}
			var icolor = ((Math.random() * 4)|0);
			console.log('{ x : ' + x + ', y : ' + y + ', glow : false, color : ' + icolor + ' },');
			Game.net.vertices.push({
				'x' : x,
				'y' : y,
				glow : true,
				colors : icolor
			});
			Game.draw();
		}
		for(i in this.net.vertices) {
			var radius = Game.net.lampsize / 2 * SCALINGFACTOR;
			var _x = this.net.vertices[i].x * SCALINGFACTOR;
			var _y = this.net.vertices[i].y * SCALINGFACTOR - radius;
			var w = x - _x;
			var h = y - _y;
			w = (w > 0) ? w : (-w);
			h = (h > 0) ? h : (-h);
			var around = Math.sqrt((w*w)+(h*h));
			//console.log('_x ' + _x + ' _y ' + _y + ' w ' + w + ' h ' + h + ' around ' + around);
			if(radius >= around){
				return {
					index : i
				}
			}	
		}
		return false;
	},
	clearcanvas : function() {
		var c = document.getElementById("canvas");
		var ctx = c.getContext("2d");
		ctx.clearRect (0, 0, GAMESPACE.X, GAMESPACE.Y);
	},
	draw : function(){
//		$('#map').html('');
		$('#red').html(Game.net.patchcount.red);
		$('#green').html(Game.net.patchcount.green);
		$('#blue').html(Game.net.patchcount.blue);
		$('#yellow').html(Game.net.patchcount.yellow);
		var c = document.getElementById("canvas");
		var ctx = c.getContext("2d");
		//ctx.fillStyle="#e5e5e5";
		//ctx.fillStyle="#ff0";
		ctx.lineWidth = 2;
		ctx.clearRect (0, 0, GAMESPACE.X, GAMESPACE.Y);
		for(i in Game.net.ties){
			var index0 = Game.net.ties[i][0];
			var index1 = Game.net.ties[i][1];
			var a = Game.net.vertices[index0];
			var b = Game.net.vertices[index1];
			//console.log( i + ' ' + a.glow + ' ' + b.glow );
			ctx.beginPath();
			ctx.moveTo(a.x * SCALINGFACTOR, a.y * SCALINGFACTOR);
			//ctx.strokeStyle = "#138CCB";
			ctx.strokeStyle = (a.glow === true && b.glow === true)?"#ff0":"#ccc";
			ctx.lineTo(b.x * SCALINGFACTOR, b.y * SCALINGFACTOR);
			//ctx.lineWidth = 1;
			ctx.stroke();
		}
		
		
		//img.onload = function() {
		//	ctx.drawImage(img, 0, 0, 50, 50);
		//}
		
/*
		var color0 = new Image();
		var color1 = new Image();
		var color2 = new Image();
		var color3 = new Image();
		var colorl0 = new Image();
		var colorl1 = new Image();
		var colorl2 = new Image();
		var colorl3 = new Image();
		
		color0.src = "color0.png";
		color1.src = "color1.png";
		color2.src = "color2.png";
		color3.src = "color3.png";
		colorl0.src = "colorl0.png";
		colorl1.src = "colorl1.png";
		colorl2.src = "colorl2.png";
		colorl3.src = "colorl3.png";
*/
		//var color0 = "color0.png";
		//var color1 = "color1.png";
		//var color2 = "color2.png";
		//var color3 = "color3.png";
		//var colorl0 = "colorl0.png";
		//var colorl1 = "colorl1.png";
		//var colorl2 = "colorl2.png";
		//var colorl3 = "colorl3.png";
		
		//alert(1);
		$('#layer1').html('');
		for(i in this.net.vertices ){
			//alert('color ' + this.net.vertices[0].color);
			//alert('color0 ' + color0);
			var a = $('<div>')
				.addClass('lamp')
				.css({
					'background-image' : ( 'url(\"color' + this.net.vertices[i].color + '.png\")' ),
					'opacity' : (this.net.vertices[i].glow || i == (this.net.vertices.length - 1))?1:0.5,
					left : ( this.net.vertices[i].x - (SIZES.lamp / 2) ) * SCALINGFACTOR,
					top : ( this.net.vertices[i].y - (SIZES.lamp / 2) ) * SCALINGFACTOR,
					width : SIZES.lamp * SCALINGFACTOR,
					height : SIZES.lamp * SCALINGFACTOR
				});
//			if( (this.net.vertices[i].glow || i == (this.net.vertices.length - 1))?'l':'' ) {
//				$(a).fadeTo(0.3);
//			}
			$('#layer1').append(a);
/*
			ctx.drawImage(color0,
				( this.net.vertices[i].x - (SIZES.lamp / 2) ) * SCALINGFACTOR,
				( this.net.vertices[i].y - (SIZES.lampmargin) ) * SCALINGFACTOR,
				SIZES.lamp * SCALINGFACTOR,
				SIZES.lamp * SCALINGFACTOR
			);
*/
			//color0.onload = function() {
//				ctx.drawImage(
//					color0,
//					50,
//					50,
//				);
			//}
			
			//alert(2);
		}
		//alert(3);
//		ctx.moveTo(0,0);
//		ctx.strokeStyle = "#ff0";
//		ctx.lineWidth = 3;
//		ctx.lineCap = 'round';
//		ctx.lineTo(200,100);		

	},
	hascolor : function(i){
		switch(i){
			case RED :
				if(Game.net.patchcount.red > 0){
					Game.net.patchcount.red--;
					return true;
				}
				break;
			case GREEN :
				if(Game.net.patchcount.green > 0){
					Game.net.patchcount.green--;
					return true;
				}
				break;
			case BLUE :
				if(Game.net.patchcount.blue > 0){
					Game.net.patchcount.blue--;
					return true;
				}
				break;
			case YELLOW :
				if(Game.net.patchcount.yellow > 0){
					Game.net.patchcount.yellow--;
					return true;
				}
				break;
		}
		return false;
	},
/*
	hasnextstep : function(){
		var colors = [0, 0, 0, 0];
		var colors2 = [];
			colors2[RED] = Game.net.patchcount.red;
			colors2[GREEN] = Game.net.patchcount.green;
			colors2[BLUE] = Game.net.patchcount.blue;
			colors2[YELLOW] = Game.net.patchcount.yellow;
		for(i in Game.net.ties){
			var i = Game.cursor;
			var a = Game.net.ties[i][0];
			var b = Game.net.ties[i][1];
			
			if(a == Game.cursor || b == Game.cursor){
				if(
					( Game.net.vertices[b].glow == false && Game.net.vertices[a].glow == true )
				) {
					colors[Game.net.vertices[b].color]++
				}
				if(
					( Game.net.vertices[a].glow == false && Game.net.vertices[b].glow == true )
				) {
					colors[Game.net.vertices[a].color]++
				}
			}
		}
		var p = 0;
		for(i in colors2){
			if(colors2[i] > 0 && colors[i] != 0){p++}
		}
		if(p > 0) {return true;}
		console.log('hasn\'t next step');
		return false;
	},
*/
	hasconnect : function(i){
		
		
		var c = parseInt(Game.cursor);
		for(j in this.net.ties){
			var a = this.net.ties[j][0];
			var b = this.net.ties[j][1];
			
			if(a == c || b == c){
				if(
					( a == i && this.net.vertices[b].glow === true ) ||
					( b == i && this.net.vertices[a].glow === true )
				){
					//console.log('connect ' + c + ' ' + i)
					return true;
				}
			}
		}
		return false;
	},
	checkwin : function(){
/*
		var r = 0, 
			g = 0, 
			b = 0;
		for(i in this.net.vertices){
			if(this.net.vertices[i].glow === true){
				if(this.net.vertices[i].color === RED){r++;}
				if(this.net.vertices[i].color === GREEN){g++;}
				if(this.net.vertices[i].color === BLUE){b++;}
			}
		}
		if( r === this.net.patchcount.red &&
			g === this.net.patchcount.green &&
			b === this.net.patchcount.blue){
			return true;
		}
*/
		if( this.net.patchcount.red === 0 &&
			this.net.patchcount.green === 0 &&
			this.net.patchcount.blue === 0)
			{return true;}
		return false;
	},
	gameover : function(){
		if(Game.debug_p || Game.debug_v || Game.debug_t){return;}
		$('#gameover').show();
		setTimeout(function(){
			$('#gameover').hide();
			document.location.reload();
		}, 3000);
	},
	win : function(){
		if(Game.debug_p || Game.debug_v || Game.debug_t){return;}
		// TODO splash win
		$('#youwin').show();
		console.log('you win');
		if( parseInt(localStorage['lightnetlevel']) < levels.length - 1 ){
			localStorage['lightnetlevel'] = parseInt(localStorage['lightnetlevel']) + 1;
			setTimeout(function(){
				$('#youwin').hide();
				Game.clearcanvas();
				Game.startgame();
			}, 3000);
		} else {
			//win all
		}
		//$('#points').html(localStorage['box5points']);
		//Game.run = false;
	},
	startgame : function(){
		var index = parseInt(localStorage['lightnetlevel']);
		Game.net = {};
		Game.net = levels[index];
		this.colnum = ( 3 + ( parseInt(localStorage['box5level']) / 3 )|0 );
		Game.width = Game.height = Game.colnum;
		//SIZES.column = GAMESPACE.X / Game.colnum;
		SIZES.lamp = Game.net.lampsize;
		SIZES.lampmargin = Game.net.lampsize / 100 * 80;
		
		this.cursor = 0;
		
		
		// TODO genmap()
		// or loadmap(level)
		// map -> vertices, ties, coordinates, glow, pathcount
		
		//this.randmap();
		
		this.draw();
		//alert('draw end');
		$('#level').html( (parseInt(localStorage['lightnetlevel']) + 1) );
		setTimeout(function(){
			Game.draw();
		}, 300);
		/*
		this.startfinish();
		this.addbroken( parseInt(localStorage['plumbinglevel']) );//добавить разбитые
		this.draw();
		setTimeout(function(){
			Game.firststep();
		}, 0);
		*/
	},
	clearall : function() {
		localStorage['lightnetpoints'] = 0;
		localStorage['lightnetlevel'] = 0;
	},
	init : function(){
		if(
			typeof(localStorage['lightnetpoints']) === 'undefined' ||
			typeof(localStorage['lightnetlevel']) === 'undefined'
		){
			localStorage['lightnetpoints'] = 0;
			localStorage['lightnetlevel'] = 0;
		}
		$('#points').html(localStorage['lightnetpoints']);
		//this.drawmap();
	}
}

$(document).ready(function(){
	Game.init();
	
	DWIDTH = document.body.clientWidth;
	DHEIGHT	= document.body.clientHeight;
	SCALINGFACTOR = DWIDTH / 320;
	BANNERHEIGHT = SCALINGFACTOR * 50;
	Game.width = Game.height = Game.colnum;
	//SIZES.column = ( DWIDTH  < 350 )?50:( DWIDTH < 750 )?70:100;
	GAMESPACE = {
		X : DWIDTH - ( SIZES.margin * 2 ),
		Y : DHEIGHT - BANNERHEIGHT - SIZES.pointsbar - ( SIZES.margin * 2 )
	}
//	SIZES.column = GAMESPACE.X / Game.colnum;
	$('#map').css({
//		width  : GAMESPACE.X,
//		height : GAMESPACE.Y,
		
	});
	$('#canvas').attr('width', GAMESPACE.X)
				.attr('height', GAMESPACE.Y);
	$('#layer1').css({
		width : GAMESPACE.X,
		height : GAMESPACE.Y,
		left   : 0,
		top    : 0
	});
//				.css({
//					left : SIZES.margin,
//					top : SIZES.margin
//				});
	//$('#canvas').click(function(e){

				
	$('#youwin').css('width', (DWIDTH - 30 + 'px'));
	$('#gameover').css('width', (DWIDTH - 30 + 'px'));
	
	$('#pointsbar').css('height', (SIZES.pointsbar * SCALINGFACTOR + 'px'));
	//console.log(SIZES.levelbar.x);
	$('#levelbar').css({
		left : (SIZES.levelbar.x * SCALINGFACTOR + 'px'),
		top : (SIZES.levelbar.y * SCALINGFACTOR + 'px')
	});
	$('#red').css({
		left : (SIZES.colors.r.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.r.y * SCALINGFACTOR + 'px')
	});
	$('#green').css({
		left : (SIZES.colors.g.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.g.y * SCALINGFACTOR + 'px')
	});
	$('#blue').css({
		left : (SIZES.colors.b.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.b.y * SCALINGFACTOR + 'px')
	});
	$('#yellow').css({
		left : (SIZES.colors.y.x * SCALINGFACTOR + 'px'),
		top : (SIZES.colors.y.y * SCALINGFACTOR + 'px')
	});
	$(document.body).css('background-size', (DWIDTH + 'px ' + DHEIGHT + 'px'));
	
	var _l, _t, _w, _h;
	_w = (200 * SCALINGFACTOR) + 'px';//548
	_h = (35 * SCALINGFACTOR);//247
	_l = (DWIDTH / 2 - 100 * SCALINGFACTOR) + 'px';
	_b = 220 / 1280 * DHEIGHT
	$('#startscreen>div:eq(0)').css({left:_l,bottom:(_b + 'px'),width:_w,height:_h + 'px'});
	_b += _h + 5;
	$('#startscreen>div:eq(1)').css({left:_l,bottom:(_b + 'px'),width:_w,height:_h + 'px'});
	
	$('#continue').click(function(){
		$('#startscreen').hide();
		//$('#mapsplash').show();
		$('#gamescreen').show();
		Game.startgame();
		//Game.drawmap();
	});
	$('#newgame').click(function(){
		$('#startscreen').hide();
		//$('#mapsplash').show();
		$('#gamescreen').show();
		Game.clearall();
		Game.startgame();
		//Game.drawmap();
	});
	
	Game.startgame();
	
	$(document).click(function(e){
		$('#debugbar').html('click');
		//console.log(e.pageX + ' ' + e.pageY);
		var l = Game.hit(
			( e.pageX - SIZES.margin ),
			( e.pageY - SIZES.margin - SIZES.pointsbar * SCALINGFACTOR )
		);
		if(l){
			//if(Game.net.patchcount <= 0 &&
			if(Game.debug_t){
				//console.log('debug_t');
				if(Game.debug_ti){
					console.log('[' + Game.debug_ti + ', ' + l.index + '],');
					Game.net.ties.push([Game.debug_ti, l.index]);
					Game.draw();
					Game.debug_ti = false
				} else{
					Game.debug_ti = l.index
				}
			}
			
			console.log('hit ' + l.index);
			$('#debugbar').html('hit');
			if(Game.net.vertices[l.index].glow == false) {
				if(Game.hasconnect(l.index)){// TODO с курсором
					console.log('connect ok');
					
					if(Game.debug_p){
						Game.net.patchcount.red    = 7;
						Game.net.patchcount.green  = 7;
						Game.net.patchcount.blue   = 7;
						Game.net.patchcount.yellow = 7;
						if(!Game.debug_pr){Game.debug_pr = 0}
						if(Game.net.vertices[l.index].color == RED){Game.debug_pr++;}
						if(!Game.debug_pg){Game.debug_pg = 0}
						if(Game.net.vertices[l.index].color == GREEN){Game.debug_pg++;}
						if(!Game.debug_pb){Game.debug_pb = 0}
						if(Game.net.vertices[l.index].color == BLUE){Game.debug_pb++;}
						if(!Game.debug_py){Game.debug_py = 0}
						if(Game.net.vertices[l.index].color == YELLOW){Game.debug_py++;}
						Game.net.vertices[l.index].glow == true;
						Game.draw();
					}
				
					if( Game.hascolor(Game.net.vertices[l.index].color) ) {
						//if( Game.hasnextstep() ) {
						Game.net.vertices[l.index].glow = true;
						//console.log(l.index + ' ' + (Game.net.vertices.length - 1));
						Game.cursor = l.index;
						if( l.index == (Game.net.vertices.length - 1) ){
							if(Game.checkwin()){
								Game.win();
							} else{
								Game.gameover();
							}
						} else if(Game.checkwin()){
							Game.gameover();
						} //else if( Game.hasnextstep() == false ){// TODO из курсора
						//	Game.gameover();
						//}
						//} else {
						//	Game.gameover();
						//}
					} else{
						Game.gameover()
						//console.log('такой цвет недоступен');
					}
				} else {
					//console.log('no connect');
				}
			}
			Game.draw();
			//TODO check patch 
			//change lamp
			//redraw all
			//console.log(l.index + ' ' + (Game.net.vertices.length - 1));
			
		} else{
			//console.log('miss');
		}
	});
});