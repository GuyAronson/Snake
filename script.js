var canvas = document.getElementById("can");
var cx = canvas.getContext("2d" ); // getting the canvas mode
canvas.width = window.innerWidth; // define the width of the canvas as the whole width of the window
canvas.height = window.innerHeight;// define the height of the canvas as the whole height of the window

//The snake compound by array of Rects/Blocks.
var snake = [];
//Array of apples
var apples = [];
//variable for the direction of the snake
var direction = 39; // right
var int; // a variable to stop the interval
var linewidth = 20;// the width of the board's boundary
var rect_width = 20;// width of each rect
var score = 0;
var gameover = false;

//our snake is going to be an array of Rects.
//Creating an Object for the Rects - require parameters (x,y)
class Rect {
	constructor(x,y){
	  this.x = x; // defining the X position of the rect
	  this.y =y; // defining the X position of the rect
	  this.width = 20; // the width of the rects
	  this.height = 20; // the height of each rect
	  this.color = 'red'; // Define the color of each rect
	}
  	//Here we have a function to draw the rect with the variables above.
  	Draw(){
	    cx.fillStyle = this.color; // we fill the rect with the color above.
	    cx.fillRect(this.x,this.y,this.width,this.height); //here we draw the rect with the X,Y,width and height.
  	}
}
//Creating an object of Apples
class Apple{
	constructor(){
		this.radius = 10; // The radius of each apple
		this.x = rect_width/2; // X position is half width so that the snake could eat the whole apple, not part of it
		this.y = rect_width/2; // Y position is half height so that the snake could eat the whole apple, not part of it
		//the width of the board divided to 64 moves of the snake. boundaries not included
		//the height of the board divided to 35 moves of the snake. boundaries not included
		var width_snakes_moves = Math.floor(canvas.width / rect_width);
		var height_snakes_moves = Math.floor(canvas.height / rect_width);
		//Here we take random location for the apple (X and Y position)
		this.x = this.x + (Math.floor(Math.random()*width_snakes_moves)*linewidth); 
		this.y = this.y + (Math.floor(Math.random()*height_snakes_moves)*linewidth);
		if(this.y <= linewidth) // if Y position is inside the boundary, we will put the apple outside it.
			this.y = this.y + linewidth*3;
		else if(this.y >= canvas.height - linewidth)
			this.y = this.y + (Math.floor(canvas.height/linewidth)-5) * linewidth;
		if(this.x <= linewidth) // if X position is inside the boundary, we will put the apple outside it.
			this.x = this.x + linewidth*3;
		else if(this.x >= canvas.width - linewidth)
			this.x = this.x + (Math.floor(canvas.width/linewidth)-5) * linewidth;
		this.color = 'green'; // the color of each apple
	}
	// A function to draw the apples
	Draw(){
		cx.fillStyle = this.color;
		cx.beginPath();
		cx.arc(this.x, this.y, this.radius, 0 , Math.PI*2);
		cx.fill();
	}	
}
//The first functino to use - building the game
function Build(length){
	// Restart the variables
	score = 0;
	snake = [];
	apples = [];
 	// first, we add the "head" of the snake
 	//The push attribute add any object to the end of the array
    snake.push(new Rect(100,100));
    // we adding more blocks for the snake
    for(var i=1;i<length;i++){
      //The X of the new block compound of the previous block's X, minus the width of the block
      snake.push(new Rect((snake[i-1].x - snake[i-1].width), snake[i-1].y)); 
    } 
    // then we add the apples to the game - 5 Apples
    for(var j=0; j<5; j++){
    	apples.push(new Apple());
    }
}
// A function to draw the board
function DrawBoard(){
	//We draw the board only if the game isnt over
	if(gameover == false){
		//we start with the boundaries.
		cx.strokeStyle = 'gray';
		cx.lineWidth = 40;
		//This line width EQUALS to 20px
		cx.strokeRect(0, 0, canvas.width, canvas.height);

		//Drawing the Score
		cx.fillStyle = 'gray';
		cx.font = "300px Arial";
		if(score<100)
			cx.fillText(score, canvas.width/2.5 ,canvas.height/1.5);
		//if the score is 3-digit number we move the text a little bit left
		else
			cx.fillText(score, canvas.width/4 ,canvas.height/1.5);

		//Drawing the apples
		for(var i=0; i <apples.length; i++){
			apples[i].Draw();
		}
	}
}
//function to draw the snake
function DrawSnake(){
	//only if the game isnt over
	if(gameover == false){
		//everytime we draw the snake - first we clear the board
		// then we draw it again eventually we draw the snake
		cx.clearRect(0, 0, canvas.width, canvas.height);
		DrawBoard();

		for (var i = 0; i < snake.length; i++) {
			snake[i].Draw();
		}

		//Drawing the eye of the snake - at the middle of the head
		cx.beginPath();
		cx.fillStyle = 'black';
		cx.arc(snake[0].x + snake[0].width/2, snake[0].y + snake[0].height/2, 2, 0, Math.PI*2);
		cx.fill();
	}
}
//Functino to draw the gameover screen
function DrawGameOver(){
	cx.strokeStyle = 'black';
	cx.lineWidth = 10;
	cx.strokeRect(200,100,canvas.width/1.5 ,canvas.height/1.5);

	cx.fillStyle = 'black';
	cx.font = "100px Arial";
	cx.fillText("Game Over!", canvas.width/3.5 ,canvas.height/2);

	cx.font = "50px Arial";
	cx.fillText("Press Space to Restart", canvas.width/3.5 ,canvas.height/1.5);
}
//Function Moving the snake UP
function MoveUp(){
	//First we need to check if the snake doesnt impact the top boundary
	if(snake[0].y - linewidth > 0){
		var new_x =  snake[0].x; // X stay the same
		var new_y = snake[0].y - snake[0].height; // changing only the Y

		// Here we add another Rect to the head of the snake to make him go forward
		snake.unshift(new Rect(new_x,new_y));
		//then we cut the tail of the snake (the last part) - pop it.
		snake.pop();
		//then we Draw the snake again, after we clear the screen
		DrawSnake();
	}
	else{
		//if the snake does impact the boundary, it's gameover
		gameover = true;
		GameOver();
	}
}
//Function Moving the snake DOWN
function MoveDown(){
	//First we need to check if the snake doesnt impact the bottom boundary
	if(snake[0].y + snake[0].height < canvas.height - linewidth){	
		var new_x =  snake[0].x; // X stay the same
		var new_y = snake[0].y + snake[0].height; // only Y changes

		// Here we add another Rect to the head of the snake to make him go forward
		snake.unshift(new Rect(new_x,new_y));
		//then we cut the tail of the snake (the last part) - pop it.
		snake.pop();
		//then we Draw the head
		DrawSnake();
	}
	else{
		//if the snake does impact the boundary, it's gameover
		gameover = true;
		GameOver();
	}
}
//Function Moving the snake LEFT
function MoveLeft(){
	//First we need to check if the snake doesnt impact the left boundary
	if(snake[0].x > linewidth){
		var new_x =  snake[0].x - snake[0].width; //Now we change the X
		var new_y = snake[0].y; // Y stays the same

		// Here we add another Rect to the head of the snake to make him go forward
		snake.unshift(new Rect(new_x,new_y));
		//then we cut the tail of the snake (the last part) - pop it.
		snake.pop();
		//then we Draw the head
		DrawSnake();
	}
	else{
		//if the snake does impact the boundary, it's gameover
		gameover = true;
		GameOver();
	}
}
//Function Moving the snake RIGHT
function MoveRight(){
	//First we need to check if the snake doesnt impact the right boundary
	if(snake[0].x < canvas.width - linewidth - snake[0].width){
		var new_x =  snake[0].x + snake[0].width;
		 // + gap;
		var new_y = snake[0].y;
		// Here we add another Rect to the head of the snake to make him go forward
		snake.unshift(new Rect(new_x,new_y));
		//then we cut the tail of the snake (the last part) - pop it.
		snake.pop();
		//then we Draw the head
		DrawSnake();
	}
	else{
		//if the snake does impact the boundary, it's gameover
		gameover = true;
		GameOver();
	}
}
//The general function to move the snake depends on the direction the player pressed
function Move(){
	//if the game isnt over yet
	if(gameover == false){
		if(direction == 37)
	    	MoveLeft();

	    else if(direction == 38)
	    	MoveUp();
	    
	    else if(direction == 39)
		  	MoveRight();
	    
	    else if(direction == 40)
		    MoveDown();

		EatApple(); // After each move of the snake,we need to check if he ate an apple
		GameOver(); // Then we check if the snake dies. (ate himself or impact the boundary)
	}
}
//Functino to check if the snake eat an apple
function EatApple(){
	//for loop to run on the apples array
	for(var i=0; i <apples.length; i++){
		//An if test, whether the apple's X and Y is the same as the CENTER of the head.
		//The X and Y of the head is not at the center.(it is at the top left of the rect)
		if(apples[i].x == snake[0].x + snake[0].width/2 && apples[i].y == snake[0].y + snake[0].height/2){
			score++; // score is increase
			apples[i] = new Apple(); // Generate a new apple
			snake.push(new Rect(snake[snake.length-1].x, snake[snake.length-1].y));// Then we enlarge the snake
		}
		//Eventually we draw the board then the snake.
		DrawBoard();
		DrawSnake();
	}
}
//A function to test of the game is over and activate the gameover draw function.
function GameOver(){
	//if the game still is not over
	if(gameover == false){
		for(var i=1; i<snake.length; i++){
			//if the snake eat himself (the position of the head and any other part of the snake is the same)
			if((snake[0].x - snake[0].width/2 == snake[i].x - snake[i].width/2) && (snake[0].y - snake[0].height/2 == snake[i].y -  snake[i].height/2))
				gameover = true;
		}
	}
	//Activate the draw gameover Function
	if(gameover == true){
		//Clearing the interval so the snake will stop move
		clearInterval(int);
		DrawGameOver();
	}
}
//Update function to keep update the game
function Update(keycode){
	//if the game still is not over
	if(gameover == false){
		//if the player pressed an arrow key.
		if(keycode == 39 || keycode == 37 || keycode == 38 || keycode == 40){
			//Then we check if the player pressed on the opposite direction (Right-Left, Up-Down)
			if((direction == 37 && keycode !=39) || (direction == 38 && keycode !=40) ||
			 (direction == 39 && keycode != 37) || (direction == 40 && keycode != 38)){
				direction = keycode; // the Direction changes
				Move(); // Actiavte the move function
			}
		}
		//Set an interval to keep running the game - so the snake keep moving
		int = window.setInterval(Move, 150); // 150 miliseconds = 0.15 sec
	}
	//if the player pressed on space the game will Restart
	if(keycode == 32){ // Space
		gameover = false;
		Build(3);
		DrawSnake();
	}
}
//First building and drawing the game
Build(3);
DrawSnake();

//an Event - key down
window.addEventListener("keydown", function(event){
    clearInterval(int); // Keep clearing the interval so it won't increase.(it will stay on 150 milisec)
    // console.log(event.keyCode);
    
    //Actiavte the update function with the key pressed.
    Update(event.keyCode);
    
});


 