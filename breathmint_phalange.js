var timex;
var seconds = 15;
var counter_threshold = 100; //allow some slack in the timer for high-falutin' browsers
var timestamp = 0;
var tictac;
var tictacs = [];
var tictac_location = [];
var tictac_boolean = [];
var tictac_tones = [
		     [255, 255, 255], //classic mint
		     [254, 138, 42],  //orange
		     [84, 224, 165]   //wintergreen
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

var number_of_things;
var container;
var container_contents = [];
var lid;
var lid_location = [0, 0, 0];
var trap_count = 0;
var tictac_row = 0;
var toed = 0;
var toe_in_a_row = 0;

var canvas_width;
var canvas_height;
var canvas_reference;

var countdown;
var rules_and_regulations;
var rules_and_regulations_content = 
"<img src = 'graphic_assets/O_as_in_Once.gif' style='width: 9%;'>nce upon a time in a pink tropical storm, TIC TAC and TOE descended from the heavens upon the roads of Monaco. <p>Capture the beloved TIC TAC (with your cursor); avoid the dreaded TOE. Three in a row will either propell you to flavour fresh satisfaction, or precisely the inverse. <p> You could play this forever.";

var win_counter = 0;
var win_count;
var win;
var win_content = 
"YOU DID IT! YOU STINKER! Go ahead, celebrate a little. You deserve it. <p> When you've finished with the celebration, prepare to have another go. Just for fizz and wiggles... see how many total tictacs you can collect in a round without losing!";

var loss_counter = 0;
var loss_count;
var loss;
var loss_content =
"Aw, bummer... [insert pun about TOEing the line]! Really tho, better luck next time.";

var stalemate; 
var stalemate_content =
"Woof. We appear to have reached an impass. Feels just like losing doesn't it? Perhaps it is up to you how to feel.";

var tictac_score; 
var toe_score; 
var game_state_toggle = false;
var round_ended_toggle = false;
var toggle = false;

function preload() {
  rules_and_regulations = createDiv();
  rules_and_regulations.style("visibility", "hidden");
  tictac_score = createDiv();
  tictac_score.style("visibility", "hidden");
  toe_score = createDiv(); 
  toe_score.style("visibility", "hidden");
  win = createDiv();
  win.style("visibility", "hidden");
  loss = createDiv();
  loss.style("visibility", "hidden");
  stalemate = createDiv();
  stalemate.style("visibility", "hidden");
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
  pixelDensity(0.33);
}

function centerCanvas(){
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas_reference.position(x, y);
}
 
/*TODO: investigate if rendering GL to an offscreen buffer e.g. createGraphics() would solve resizing issue*/
function windowResized(){
  canvas_width = windowWidth;
  canvas_height = windowHeight;
  canvas_reference=createCanvas(canvas_width, canvas_height, WEBGL); //Temporary Necessary Evil
  centerCanvas();
}

function objectsInit(){
  if(number_of_things){
    tictacs.splice(0, number_of_things);
    tictac_boolean.splice(0, number_of_things);
    toes.splice(0, number_of_things);
    toe_boolean.splice(0, number_of_things);
  }
  
  number_of_things = round(random(4, 15));
  
  for(var i=0; i<number_of_things; i++) {
    tictacs.push(new fallingObjects(tictac, i));
    let model_xyz = [0, 0, 0, "tictac"];
    tictac_location.push(model_xyz);
    tictac_boolean.push(false);
    toes.push(new fallingObjects(toe, i));
    model_xyz = [0, 0, 0, "toe"];
    toe_location.push(model_xyz);
    toe_boolean.push(false);
  }
}

function draw() {
  let lightX = (mouseX / canvas_width  - 0.3) * 2;
  let lightY = (mouseY / canvas_height - 0.3) * 2;
  directionalLight(110, 110, 110, lightX, lightY, 0.6);
  ambientLight(180);
  handleTicTacBox(container, 94);
  handleTicTacBox(lid, 255);
  rememberTheTime();
  typist(subject_matter);
}

function rememberTheTime(){
  timex = round(millis()) - timestamp;
  countdown = "<p>The next round will begin in 00:" + nf(map(round(timex/1000), 0, 15, 15, 0), 2, 0);
  rules_and_regulations.html(rules_and_regulations_content + countdown);
  win.html(win_content + countdown);
  loss.html(loss_content + countdown);
  stalemate.html(stalemate_content + countdown);
}

function gamePlay(game_state) {
  if(game_state){
    for(var i=0; i<number_of_things; i++){
      if(tictac_boolean[i] == true){ 
        tictacs[i].resting();  
        tictacs[i].styling();
        toes[i].falling();
        toes[i].styling();
      }else{
        tictacs[i].falling();
        tictacs[i].styling();
        toes[i].falling();
        toes[i].styling();
      }
    }

    embraceIntersection(tictacs, tictac_location);
    embraceIntersection(toes, toe_location);
    
    if(tictac_row >= 3){
      subject_matter = win;
      win_counter++;
      timestamp = round(millis());
      round_ended_toggle = true;
    }else if(toe_in_a_row >= 3){
      subject_matter = loss;
      loss_counter++;
      timestamp = round(millis());
      round_ended_toggle = true;
    }else if(number_of_things - trap_count < 3 && tictac_row < 1){
      subject_matter = stalemate;
      timestamp = round(millis());
      round_ended_toggle = true;
    }

  }else if(subject_matter != rules_and_regulations){
    endRoundGracefully();
  }
}

function endRoundGracefully(){
    for(var i=0; i<number_of_things; i++){
      tictac_boolean[i] = false;
      tictacs[i].falling();
      tictacs[i].styling();
      toes[i].falling();
      toes[i].styling();
    }
}

function embraceIntersection(model_to_embrace, locator){
  let modelX, modelY, modelZ, lidX, lidY, range, previous_state, current_state; 

  for(var i=0; i < model_to_embrace.length; i++){
    modelX = locator[i][0];
    modelY = locator[i][1];
    modelZ = locator[i][2];
    if(model_to_embrace == tictacs){
      previous_state = tictac_boolean[i];
    }else if (model_to_embrace == toes){
      previous_state = toe_boolean[i];
    } 
    lidX = lid_location[0];
    lidY = lid_location[1];
    range = 25;

    if(nearEnoughNeighbor(modelX, lidX-range, lidX+range) && nearEnoughNeighbor(modelY, lidY-range, lidY+range)){
      if(model_to_embrace == toes){
        toe_boolean[i] = true;
        current_state = toe_boolean[i];
        if(current_state != previous_state){
          tictac_row = 0;
          toed++;
          toe_in_a_row++;
          previous_state = current_state;
        }
      }else if(model_to_embrace == tictacs){ 
        tictac_boolean[i] = true;
        current_state = tictac_boolean[i];
        if(current_state != previous_state){
          toe_in_a_row = 0;
          trap_count++;
          tictac_row++;
          previous_state = current_state;
        }
      }
    }
  }
}

function nearEnoughNeighbor(x, minim, maxim){
     return x >= minim && x <= maxim;
}

function handleTicTacBox(model_to_use, alpha){
  let x = mouseX - canvas_width/1.72
  let y = mouseY - canvas_height/4;  //(mouseY/3)+200;
  let z = 0;
  push();
    lid_location[0] = round(mouseX);
    lid_location[1] = round(mouseY); 
    lid_location[2] = z; 
    translate(x, y, z);
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

  if(this.model == tictac){
    this.tone = tictac_tones[abs(round(random(tictac_tones.length))-1)];
    this.scale = (0.3);
  }else{
    this.tone = toe_tones[round(random(toe_tones.length))];
    this.scale = (0.6);
  };

  this.falling = function() {
    this.y += this.speed;
    this.rotation = frameCount;
    if(this.model == tictac){
      tictac_location[id][0]=round(this.x);
      tictac_location[id][1]=round(this.y);
      tictac_location[id][2]=round(this.z);
    }else if(this.model == toe){
      toe_location[id][0]=round(this.x);
      toe_location[id][1]=round(this.y);
      toe_location[id][2]=round(this.z);
    }
    if(this.y > canvas_height + 400 && round_ended_toggle == false){ 
      this.y = 0;
      this.x = random(canvas_width);
      this.speed = random(3, 13);
      if(this.model == tictac){
	this.tone = tictac_tones[abs(round(random(tictac_tones.length))-1)];
      }else{
	this.tone = toe_tones[abs(round(random(toe_tones.length))-1)];
        toe_boolean[id] = false;
      }
    }
  };

  this.resting = function() { 
    push();
    this.scale = (0.225, 0.225, 0.225);
    this.rotation = 1;
    this.x = lid_location[0] - canvas_width * 0.065 + 25*id + 5; //TODO clean up this mathfire
    this.y = lid_location[1] + (canvas_height/4 - 25);
    this.z = lid_location[2];
    if(id > 4 && id < 10){
      this.x -= 125;
      this.y -= 30;
    }else if(id > 9){
      this.x -= 250;
      this.y -= 60;
    }
    this.xRotate = radians(this.x);
    this.yRotate = radians(120);
    this.zRotate = radians(0);
    pop();
  };

  this.styling = function() {
    let tone_offset = 0;
    push();
      translate(-canvas_width/2 + this.x, -canvas_height/2 + this.y, this.z);
      rotateX(this.rotation * this.xRotate);
      rotateY(this.rotation * this.yRotate);
      rotateZ(this.rotation * this.zRotate);
      scale(this.scale, this.scale, this.scale);
      if(this.tone){
	ambientMaterial (this.tone[0] + tone_offset, this.tone[1]+tone_offset, this.tone[2]+tone_offset, 255);
      }else{
	ambientMaterial (100, 255);
      } 
      model(model_to_use);
    pop();
  };
}

function typist(task){
  if(timex < seconds * 1000){
    task.style("visibility", "visible");
    game_state_toggle = false;
    gamePlay(game_state_toggle);
    typeSetter(task);
  }else if(nearEnoughNeighbor(timex, (seconds * 1000) - counter_threshold, (seconds * 1000) + counter_threshold)){
    round_ended_toggle = false;
    trap_count = 0;
    tictac_row = 0;
    toed = 0;
    toe_in_a_row = 0;
    objectsInit();
  }else{
    task.style("visibility", "hidden");
    game_state_toggle = true; 
    gamePlay(game_state_toggle);
    typeSetter(task);
  }
}

function mousePressed(){
  if(!toggle){
    if(mouseX > canvas_width-90 && mouseX < canvas_width && mouseY > 0 && mouseY < 90) {
      toggle = true;
      fullscreen(toggle);
      windowResized();
    }
  }else{
    if(mouseX > canvas_width-90 && mouseX < canvas_width && mouseY > 0 && mouseY < 90) {
      toggle = false;
      fullscreen(toggle);
      windowResized();
    }
  }
} 

/*prevent canvas drag in browser on touch input devices*/
function touchMoved() {
  return false;
}

function typeSetter(message){
  message.style("position", 20, 20);
  message.style("padding", "5%");
  message.style("font-size", "2vw");
  message.style("font-family", "Arial");
  message.style("color", "#FFEEAA");
  tictac_score.html("Tictacs caught in a row: " + nf(tictac_row) + "<br>Tictac Total: " + nf(trap_count) + "/" + nf(number_of_things) + "<br>Win Count: " + nf(win_counter));
  tictac_score.style("visibility", "visible");
  tictac_score.style("left", "0px");
  tictac_score.style("position", "fixed");
  tictac_score.style("bottom", "0px");
  tictac_score.style("padding", "1%");
  tictac_score.style("font-size", "2vw");
  tictac_score.style("font-family", "Arial");
  tictac_score.style("color", "#FFEEAA");
  toe_score.html("Struck by: " + nf(toe_in_a_row) +  " toes in a row<br>Toes Total: " + nf(toed) + "/" + nf(number_of_things) + "<br>Loss Count: " + nf(loss_counter));
  toe_score.style("visibility", "visible");
  toe_score.style("position", "fixed");
  toe_score.style("right", "0px");
  toe_score.style("bottom", "0px");
  toe_score.style("text-align", "right");
  toe_score.style("padding", "1%");
  toe_score.style("font-size", "2vw");
  toe_score.style("font-family", "Arial");
  toe_score.style("color", "#FFEEAA");
}

(function titleScroller(content) {
  document.title = content;
  setTimeout(function () {
    titleScroller(content.substr(1) + content.substr(0, 1));
  }, 90);
}(" TIC TAC TOE: Breathmint Phalange Gaiden Special Edition | "));
