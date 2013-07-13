$(function() {

    ///// WORLD /////

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

    var tick = -1;
    var progStep = -1;

	var updateWorld = function() {
		if (isAnimating) {
            tick = tick + 1;
            if ((tick % 30) == 0) {
                // start of a tick; evaluate next step in program
                progStep = (progStep + 1) % program.length; // TODO(cbhl): don't hard-code this!
                updateProgramButtons();
                switch(program[progStep]) {
                    case DO_NOTHING:
                        world.player.speed.x = 0;
                        world.player.speed.y = 0;
                        break;
                    case MOVE_RIGHT:
                        world.player.speed.x = 50/60;
                        world.player.speed.y = 0;
                        break;
                    case MOVE_UP:
                        world.player.speed.x = 0;
                        world.player.speed.y = -50/60;
                        break;
                    case MOVE_LEFT:
                        world.player.speed.x = -50/60;
                        world.player.speed.y = 0;
                        break;
                    case MOVE_DOWN:
                        world.player.speed.x = 0;
                        world.player.speed.y = 50/60;
                        break;
                    default:
                        world.player.speed.x = 0;
                        world.player.speed.y = 0;
                        break;
                }
            }
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

    ///// UI /////
	
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

    ///// PROGRAM /////
    var DO_NOTHING = 0;
    var MOVE_RIGHT = 1;
    var MOVE_UP = 2;
    var MOVE_LEFT = 3;
    var MOVE_DOWN = 4;
    var classes = ['icon-empty', 'icon-arrow-right', 'icon-arrow-up', 'icon-arrow-left', 'icon-arrow-down'];
    var program = [DO_NOTHING, DO_NOTHING, DO_NOTHING, DO_NOTHING, DO_NOTHING];
    var buttons = null;

    var onProgramButtonClick = function(index) {
        program[index] = (program[index] + 1) % classes.length;
        updateProgramButtons();
    };

    var updateProgramButtons = function() {
        // TODO(cbhl): Replace with O(1) operation
        classes_str = classes.join(" ");
        _.each(buttons, function(button, index) {
            button.removeClass(classes_str);
            button.addClass(classes[program[index]]);
            if (progStep == index) {
                button.addClass("active");
            }else{
                button.removeClass("active");
            }
        });
    };

    var initProgramButtons = function() {
        buttons = _.map(program, function(element, index) {
            var button = $("<div>").addClass('btn btn-large cmd-btn');
            button.click(_.bind(onProgramButtonClick, button, index));
            return button;
        });
        $('#command').append(buttons);
        updateProgramButtons();
    };

    initProgramButtons();

});
