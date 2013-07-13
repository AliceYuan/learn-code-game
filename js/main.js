$(function() {

	// do stuff
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
			x: 0,
			y: 0
		},
		r: 25
	};

	world['ring'] = {
		x: 1000,
		y: 350,
		r: 10
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

	var updateWorld = function() {
		if (isAnimating) {
			world.player.x += world.player.speed.x;
			world.player.y += world.player.speed.y;
		}
	};

	var draw = function() {
		updateWorld();

		drawEarth();
		drawPlayer(world.player);

		// TODO(cbhl): cross-browser compatibility
		window.requestAnimationFrame(draw);
	};

	draw();

	var playPauseButton = function () {
		isAnimating = !isAnimating;
	};

	$('#btn-play').click(playPauseButton);



});
