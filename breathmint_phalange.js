var timex;
var seconds = 15;
var timestamp = 0;

var tictac;
var tictacs = [];
var tictac_location = [];
var tictac_boolean = [];
var tictac_tones = [
		     [255, 255, 255], //white
		     [254, 138, 42], //orange
		     [84, 224, 165] //wintergreen
		   ];

var toe;
var toes = [];
var toe_location = [];
var toe_boolean = [];
var toe_tones = [
		  [250, 230, 194],
		  [210, 171, 136],
		  [164, 122, 93],
		  [138, 105, 71],
		  [124, 80, 53],
		  [106, 75, 56],
		  [86, 52, 41],
		  [91, 49, 39],
		  [174, 147, 128],
		  [153, 105, 89],
		  [139, 99, 70],
		  [128, 90, 62],
		  [121, 73, 45],
		  [113, 67, 43],
		  [101, 55, 42],
		  [74, 44, 34],
		  [58, 37, 32]
];

var respawn_boolean = true;
var number_of_things;
var container;
var container_contents = [];
var lid;
var lid_location = [0, 0, 0];
var trap_count = 0;
var toe_count = 0;
var zLocater = 120;

var canvas_width;
var canvas_height;
var canvas_reference;

var rules_and_regulations;
var rules_and_regulations_content = 
"Once upon a time in a pink tropical storm, TIC TAC and TOE descended from the heavens upon the roads of Monaco. <p>Capture the beloved TIC TAC (with your cursor); avoid the dreaded TOE. Three in a row will either propell you to flavour fresh satisfaction, or precisely the inverse. <p> you could play this forever.";

var win;
var win_content = 
"YOU DID IT! YOU STINKER! <p> Prepare to have another go!";

var loss;
var loss_content =
"Aw, bummer... [pun about TOEing the line]!";

var win_counter = 0;
var tictac_score; 
var toe_score; 
var game_state_boolean = false;
var toggle = false;

function preload() {
  rules_and_regulations = createDiv(rules_and_regulations_content);
  rules_and_regulations.style("visibility", "hidden");
  win = createDiv(win_content);
  win.style("visibility", "hidden");
  loss = createDiv(loss_content);
  loss.style("visibility", "hidden");
  tictac_score = createDiv();
  tictac_score.style("visibility", "hidden");
  toe_score = createDiv(); 
  toe_score.style("visibility", "hidden");
  win_count = createDiv(); 
  win_count.style("visibility", "hidden");

  subject_matter = rules_and_regulations;
  tictac = loadModel('./3D_assets/tictac.obj');
  toe = loadModel('./3D_assets/toe.obj');
  container = loadModel('./3D_assets/container.obj');
  lid = loadModel('./3D_assets/container_lid.obj');
}

function setup() {
  canvas_width = windowWidth;
  canvas_height = windowHeight;
  canvas_reference = createCanvas(canvas_width, canvas_height, WEBGL);
  centerCanvas();
  objectsInit();
}

 function centerCanvas(){
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas_reference.position(x, y);
}

//TODO investigate if rendering gl to an offscreen buffer e.g. createGraphics() would solve rezising issue
function windowResized(){
  canvas_width = windowWidth;
  canvas_height = windowHeight;
  canvas_reference=createCanvas(canvas_width, canvas_height, WEBGL); // THIS IS PARTICULARLY NASTY, HOWEVER IT SEEMS TO BE THE ONLY WAY TO RE-INSTANTIATE THE SIZE OF THE WEBGL CONTEXT IF THE THE WINDOW-SIZE CHANGES. 
  centerCanvas();
}

function objectsInit(){
  if (number_of_things){
    tictacs.splice(0, number_of_things);         // erases history, should it already exist 
    tictac_boolean.splice(0, number_of_things);  // samesies
    toes.splice(0, number_of_things);            // ""
  }
  
  number_of_things = round(random(4, 12));
  
  for (var i=0; i<number_of_things; i++) {
    tictacs.push(new fallingObjects(tictac, i));
    var model_xyz = [0, 0, 0, "tictac"];
    tictac_location.push(model_xyz);
    tictac_boolean.push(false);
    toes.push(new fallingObjects(toe, i));
    model_xyz = [0, 0, 0, "toe"];
    toe_location.push(model_xyz);
    toe_boolean.push(false);
  }
}

function draw() {
  var lightY = (mouseY / height - 0.3) * 2;
  var lightX = (mouseX / width  - 0.3) * 2;
  directionalLight(110, 110, 110, lightX, lightY, 0.6);
  ambientLight(180);
  timex = millis() - timestamp;
  typist(subject_matter);
}

function gamePlay(game_state) {
  scoreFormatter();
  for (var i=0; i<number_of_things; i++) {
    if (tictac_boolean[i] == true){
      tictacs[i].rKelly();
      tictacs[i].headsUp();
      toes[i].graceKelly();
      toes[i].headsUp();
    }else{
      tictacs[i].graceKelly();
      tictacs[i].headsUp();
      toes[i].graceKelly();
      toes[i].headsUp();
    }
  }

  if(game_state){
    embraceIntersection(tictacs);
    embraceIntersection(toes);
  }

  if (trap_count == number_of_things){
    subject_matter = win;
    win_counter++;
    timestamp = millis();
    trap_count = 0;
    objectsInit();
  }
}

function scoreFormatter(){
  tictac_score.html ("Tictac Count: " + nf(trap_count));
  tictac_score.style("visibility", "visible");
  tictac_score.style("position", 0, canvas_height-80);
  tictac_score.style("padding", "2%");
  tictac_score.style("font-size", "3vw");
  tictac_score.style("font-family", "Arial");
  tictac_score.style("color", "#FFEEAA");
  toe_score.html ("Toe Count: " + nf(toe_count));
  toe_score.style("visibility", "visible");
  toe_score.style("position", canvas_width - 350, canvas_height-80);
  toe_score.style("text-align", "right");
  toe_score.style("padding", "2%");
  toe_score.style("font-size", "3vw");
  toe_score.style("font-family", "Arial");
  toe_score.style("color", "#FFEEAA");
  win_count.html ("Wins: " + nf(win_counter));
  win_count.style("visibility", "visible");
  win_count.style("position", 0, canvas_height-110);
  win_count.style("text-align", "right");
  win_count.style("padding", "2%");
  win_count.style("font-size", "2vw");
  win_count.style("font-family", "Arial");
  win_count.style("color", "#FFEEAA");
}

// TODO add toe_location!!!!!!!
function embraceIntersection(model_to_embrace){
  var modelX, modelY, modelZ, lidX, lidY, range, previous_state, current_state;

  for(var i=0; i < model_to_embrace.length; i++){
    modelX = tictac_location[i][0];
    modelY = tictac_location[i][1];
    modelZ = tictac_location[i][2];
    previous_state = tictac_boolean[i];
    lidX = lid_location[0];
    lidY = lid_location[1];
    range = 25;

    if (nearEnoughNeighbor(modelX, lidX-range, lidX+range) && nearEnoughNeighbor(modelY, lidY-range, lidY+range)){
      tictac_boolean[i] = true;
      current_state = tictac_boolean[i];
      if(current_state != previous_state){
	trap_count++;
	previous_state = current_state;
      }
    }
  }
}

// logical assitance for x/y ranges
function nearEnoughNeighbor(x, minim, maxim){
     return x >= minim && x <= maxim;
}

function handleTicTacBox(model_to_use, alpha){
  var x = mouseX - canvas_width/1.75;
  var y = (mouseY/3)+200;
  var z = 0;
  push();
    lid_location[0] = round(mouseX);
    lid_location[1] = round(mouseY);
    lid_location[2] = round(z - zLocater);
    translate(x, y, z - zLocater);
    fill(255, 255, 255, 80);
    ambientMaterial(255,alpha);
    scale(1, 1.2, 0.3);
    model(model_to_use);
  pop();
}

function fallingObjects(model_to_use, id){
  this.x = random(canvas_width);
  this.y = -100;
  this.z = random(100, -100);
  this.speed = random(3, 13);
  this.rotation;
  this.xRotate = random(0.00, 0.10);
  this.yRotate = random(0.00, 0.10);
  this.zRotate = random(0.00, 0.10);
  this.model = model_to_use;

  if (this.model == tictac){
    this.tone = tictac_tones[abs(round(random(tictac_tones.length))-1)];
    this.scale = (0.3);
  }else{
    this.tone = toe_tones[round(random(toe_tones.length))];
    this.scale = (0.6);
  };

  //TODO this only handles tictacs - handle toes next
  //an object falls from...

  this.graceKelly = function() { //...that is
    this.y += this.speed;
    this.rotation = frameCount;
    if (this.model == tictac){
      tictac_location[id][0]=round(this.x);
      tictac_location[id][1]=round(this.y);
      tictac_location[id][2]=round(this.z);
    }
    if (this.y > height + 400 && game_state_boolean == true){ //TODO: fix respawning -- also use canvas_height instead of height
      this.y = 0;
      this.x = random(canvas_width);
      this.speed = random(3, 13);
      if (this.model == tictac){
	this.tone = tictac_tones[abs(round(random(tictac_tones.length))-1)];
      }else{
	this.tone = toe_tones[abs(round(random(toe_tones.length))-1)];
      }
    }else if (this.y > height + 400 && game_state_boolean == false){
      //console.log("WE HAVE REACHED THE FALSE GAME STATE IN GRACE KELLY – SHOULD START REMOVING TOES");
      //toes.splice(id, 1);
    }
  };

  //an object gets trapped...
  this.rKelly = function() {
    push();
    this.scale = (0.225, 0.225, 0.225);
    this.rotation = 1;
    this.x = lid_location[0] -canvas_width*0.065 + 25*id;
    this.y = (mouseY/3)+canvas_height*.71;
    this.z = lid_location[2];
    this.xRotate = radians(this.x);
    this.yRotate = radians(120);
    this.zRotate = radians(0);
    pop();
  };

  //falling function
  this.headsUp = function() {
    var tone_offset = 0;
    push();
      translate(-canvas_width/2 + this.x, -canvas_height/2 + this.y, this.z);
      rotateX(this.rotation * this.xRotate);
      rotateY(this.rotation * this.yRotate);
      rotateZ(this.rotation * this.zRotate);
      scale(this.scale, this.scale, this.scale);
      if (this.tone){
	ambientMaterial (this.tone[0] + tone_offset, this.tone[1]+tone_offset, this.tone[2]+tone_offset, 255);
      } else {
	ambientMaterial (100, 255);
      } 
      model(model_to_use);
    pop();
  };
}

function typist(task){
  handleTicTacBox(container, 170);
  handleTicTacBox(lid, 255);
  task.style("position", 20, 20);
  task.style("text-align", "center");
  task.style("padding", "5%");
  task.style("font-size", "3vw");
  task.style("font-family", "Arial");
  task.style("color", "#FFEEAA");

  if (timex < seconds * 1000){
    if(task != rules_and_regulations){
     for(var i = 0; i < trap_count; i++){
       tictacs[i].rKelly();
       tictacs[i].headsUp();
     }
    }
    task.style("visibility", "visible");
    game_state_boolean = false;
    gamePlay(game_state_boolean);
  }else{
    task.style("visibility", "hidden");
    game_state_boolean = true; 
    gamePlay(game_state_boolean);
  }
}

function mousePressed(){
  if(!toggle){
    if(mouseX > canvas_width-90 && mouseX < canvas_width && mouseY > 0 && mouseY < 90) {
      toggle = true;
      fullscreen(toggle);
    }
  }else{
    if(mouseX > canvas_width-90 && mouseX < canvas_width && mouseY > 0 && mouseY < 90) {
      toggle = false;
      fullscreen(toggle);
    }
  }
} 


//javascript helper
(function titleScroller(content) {
    document.title = content;
    setTimeout(function () {
        titleScroller(content.substr(1) + content.substr(0, 1));
    }, 90);
}(" TIC TAC TOE: Breathmint Phalange Gaiden Special Edition "));

