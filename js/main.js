$(function() {

	var w_canvas = document.getElementById("world");
	var w_context = w_canvas.getContext("2d");
	// w_context.fillRect(50, 25, 150, 100);

	var world = {
		width: 1050,
		height: 400
	};

	world['player'] = {
		x: 40,
		y: 350,
		speed: {
			x: 2,
			y: 0
		},
		r: 25
	};

	world['ring'] = {
		x: 1000,
		y: 350,
		r: 10
	};


	world['obstacle'] = {
		x: 600,
		y: 390,
		r: 20
	};

	var initialWorld = $.extend(true, {}, world); // deep copy

	var isAnimating = false;

	var restartWorld = function() {
		world = $.extend(true, {}, initialWorld);
		isAnimating = false;
	};

	var drawPlayer = function(player) {
		var charColor = 'yellow';
		var charStrokeW = 5;
		var charStrokeColor = '#FF9000';

		w_context.beginPath();
		w_context.arc(player.x, player.y, player.r, 0, 2 * Math.PI, false);
		w_context.fillStyle = charColor;
		w_context.fill();
		w_context.lineWidth = charStrokeW;
		w_context.strokeStyle = charStrokeColor;
		w_context.stroke();
	};

	var drawEarth = function() {
		w_context.fillStyle = '#AACCFF';
		w_context.fillRect(0, 0, world.width, world.height - 10);
		w_context.fillStyle = '#008000';
		w_context.fillRect(0, world.height - 10, world.width, world.height);
	};

	var drawObstacle = function(size, obstacle){
		var obsColor = 'grey';
		var obsStrokeW = 2;
		var obsStrokeColor = 'black';

		w_context.beginPath();
		w_context.arc(obstacle.x, obstacle.y, obstacle.r, Math.PI, Math.PI*2, false);
		w_context.closePath();
		w_context.fillStyle = obsColor;
		w_context.fill();
		w_context.lineWidth = obsStrokeW;
		w_context.strokeStyle = obsStrokeColor;
		w_context.stroke();

	};

	var isCloseToObstacle = function(player, obstacle) {
		if (player.x > (obstacle.x - obstacle.r*2) && player.x < (obstacle.x + obstacle.r*2)) {
			return true;
		}
		return false;
	};

	var updateWorld = function() {
		if (isAnimating) {
			if (!isCloseToObstacle(world.player, world.obstacle)){
				world.player.x += world.player.speed.x;
				world.player.y += world.player.speed.y;
			}
		}
	};

	var draw = function() {
		updateWorld();
		drawEarth();
		drawObstacle(1, world.obstacle);
		if (world.player.x < world.width)
			drawPlayer(world.player);

		// TODO(cbhl): cross-browser compatibility
		window.requestAnimationFrame(draw);
	};

	draw();

	var displayPause = function (){
		$('#controls .btn').text(" Pause");
		$('#controls .btn').removeClass("icon-play").addClass("icon-pause");
	};

	var displayPlay = function (){
		$('#controls .btn').text(" Play");
		$('#controls .btn').removeClass("icon-pause").addClass("icon-play");
	};

	var playPauseButton = function () {
		if (isAnimating) {
			displayPlay();
		} else {
			displayPause();

		}
		isAnimating = !isAnimating;
	};

	$('#btn-play').click(playPauseButton);

    var buttons = [
        $("<div>").addClass('btn btn-large cmd-right icon-arrow-right'),
        $("<div>").addClass('btn btn-large cmd-left icon-arrow-left'),
        $("<div>").addClass('btn btn-large cmd-up icon-arrow-up')
    ];


    $('#command').append(buttons);
});
