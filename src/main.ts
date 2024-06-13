let startButton: HTMLElement | null = document.getElementById("startButton");
let controls: HTMLElement | null = document.getElementById("controls");
let mobile: HTMLElement | null = document.getElementById("mobile");
if (startButton) {
    startButton.addEventListener("click", () => {
        if (startButton) {
            startButton.style.display = "none"; // Hide the start button
            controls?controls.style.display = "none":undefined; // Hide the start button
            mobile?mobile.style.display = "none":undefined;
            initGame(); // Call the function to start the game
        }
    });
}

//Defining the doodler interface
interface Doodler {
    img: HTMLImageElement | null;
    x: number;
    y: number;
    width: number;
    height: number;
}


//Defining the platform interface
interface Platform {
    img: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
    broken: boolean;
    moveable: boolean;
    jetpack: boolean;
    trampoline: boolean; 
}

let board: HTMLCanvasElement;
let boardWidth: number = 360;
let boardHeight: number = 576;
let context: CanvasRenderingContext2D;
let jetPack=false
let trampoline=false
// Setting all the properties for the doodler
let doodlerWidth: number = 52;
let doodlerHeight: number = 52;
let doodlerX: number = boardWidth / 2 - doodlerWidth / 2;
let doodlerY: number = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg: HTMLImageElement;
let doodlerLeftImg: HTMLImageElement;
let jetpackImg: HTMLImageElement;
let doodlerFlyingImg: HTMLImageElement;
let trampolineImg: HTMLImageElement;


//Object creation for the doodler
let doodler: Doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
}

//Setting all the physical properties for the doodler
let velocityX: number = 0;
let velocityY: number = 0; // Doodler jump speed
let initialVelocityY: number = -8; 
let gravity: number = 0.3;

//Function to calculate probablity of 10%


function probability(num: number) {
	const rand = random(num);
	if (rand < 20 && rand % 2 === 0) return true;
	return false;
}

function random(max: number) {
	return Math.floor(Math.random() * max);
}


// Initializing the platform properties
let platformArray: Platform[] = [];
let platformWidth: number = 60;
let platformHeight: number = 18;
let platformImg: HTMLImageElement;
let brokenPlatformImg: HTMLImageElement;


//Setting the score and maxScore and gameOver
let score: number = 0;
let maxScore: number = 0;
let gameOver: boolean = false;
let isPaused: boolean = false;



//Loading all the images as soon the window loads
window.onload = () => {
    board = document.getElementById("board") as HTMLCanvasElement;
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d") as CanvasRenderingContext2D; // Used for drawing on the board

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./assets/doodler-right.png";
    doodlerRightImg.onload = () => {
        doodler.img = doodlerRightImg;

    }
    doodlerRightImg.onerror = handleError;

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./assets/doodler-left.png";
    doodlerLeftImg.onerror = handleError;

    platformImg = new Image();
    platformImg.src = "./assets/platform.png";
    platformImg.onload = () => {

    }
    platformImg.onerror = handleError;

    brokenPlatformImg = new Image();
    brokenPlatformImg.src = "./assets/platform-broken.png";
    brokenPlatformImg.onload = () => {

    }
    brokenPlatformImg.onerror = handleError;

    jetpackImg = new Image();
jetpackImg.src = "./assets/jet-pack.png";
jetpackImg.onload = () => {

}
jetpackImg.onerror = handleError;

doodlerFlyingImg = new Image();
doodlerFlyingImg.src = "./assets/doodler-flying.webp";
doodlerFlyingImg.onload = () => {

}
doodlerFlyingImg.onerror = handleError;
trampolineImg = new Image();
trampolineImg.src = "./assets/trampoline.png";
trampolineImg.onload = () => {

}
trampolineImg.onerror = handleError;

    
}

//Error if the image is failed to load
function handleError() {
    console.error("Failed to load image.");
}



//Initializing the game states
function initGame() {
    if (doodlerRightImg.complete && platformImg.complete && brokenPlatformImg.complete) {
        velocityY = initialVelocityY;
        placePlatforms();
        requestAnimationFrame(update);
        document.addEventListener("keydown", moveDoodler);
       
    }
}


//Main game loop
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    if (isPaused) return;

    context.clearRect(0, 0, board.width, board.height);

    doodler.x += velocityX;

    // Handling the condition when the doodler goes out of bounds in X-direction
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }
    if(doodler.y<boardHeight/4){
        doodler.y=boardHeight/4
    }
    velocityY += gravity;
    doodler.y += velocityY;

    // Game over if the doodler reaches the bottom of the canvas
    if (doodler.y > board.height) {
        gameOver = true;
    }

    context.drawImage(doodler.img!, doodler.x, doodler.y, doodler.width, doodler.height);

    const moveablePlatformSpeed = 2; // Setting the speed of the moveable platforms

    // Update and draw platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];

        // Draw different types of platforms
        if (platform.jetpack) {
            context.drawImage(jetpackImg, platform.x, platform.y - 30, platform.width, platform.height + 10); // Adjust positioning for jetpack image
        } else if (platform.trampoline) {
            context.drawImage(trampolineImg, platform.x, platform.y - 30, platform.width, platform.height + 20); // Adjust positioning for the trampoline image
        } else {
            context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
        }

        // Move moveable platforms horizontally
        if (platform.moveable) {
            platform.x += moveablePlatformSpeed;

            // Wrap platform around the canvas
            if (platform.x > boardWidth) {
                platform.x = -platform.width;
            } else if (platform.x + platform.width < 0) {
                platform.x = boardWidth;
            }
        }

        // Adjust platform y-position when doodler is moving upwards
        if (velocityY < 0 && doodler.y < boardHeight - 5) {
            jetPack==true?platform.y -= initialVelocityY-20:platform.y-=initialVelocityY
        }

        // Detect collision between doodler and platform
        if (detectCollision(doodler, platform)) {
            if (platform.jetpack) {
                console.log("Hello");
                

                jetPack=true
                jetPack==true? gravity=0:gravity=0.3; // Adjusting the velocity for jetpack jump
                jetPack==true?doodler.img = doodlerFlyingImg:doodlerLeftImg; // Changing doodler image to flying state
                
                
               var timeOut=setTimeout(()=>{
                  jetPack=false
                  gravity=0.3
                  doodler.img=doodlerLeftImg
                  platform.y-=initialVelocityY
                  clearTimeout(timeOut)
               },2000)


            } else if (platform.trampoline) {
                


                velocityY = initialVelocityY
           
            } else if (platform.broken && doodler.y + doodler.height <= platform.y + velocityY) {
                gameOver = true;
            } else if (!platform.broken && velocityY >= 0) {
                velocityY = initialVelocityY; // Stopping the doodler momentarily

               
            }
        }

        // Draw regular platform image
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // Clear platforms that are below the board height and add new ones at the top
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // Remove first element from the array
        newPlatform(); // Replace with new platform on top
    }

    // Handle score display
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score.toString(), 5, 20);

    // Display game over message
    if (gameOver) {
        context.fillText("Oops!! Press Space to restart", boardWidth / 4, boardHeight * 7 / 8);
    }
}




//All the keyboard events are handled here 
function moveDoodler(e: KeyboardEvent) {
    if (e.code === "ArrowRight" || e.code === "KeyD") { // Move right
        velocityX = 4;
        jetPack==false?doodler.img = doodlerRightImg:doodlerFlyingImg;
      
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") { // Move left
        velocityX = -4;
       jetPack==false?doodler.img = doodlerLeftImg:doodlerFlyingImg;
        
    } else if (e.code === "Space" && gameOver) {
        // Reseting the game to the initial state
        doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width: doodlerWidth,
            height: doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
    
   

}

document.addEventListener('keyup', function(e) {
    // Reset velocity when key is released
    if (e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === "KeyD" || e.code === "KeyA") {
        velocityX = 0;
    }
});

function placePlatforms() {
    platformArray = [];

    // Starting platform (always normal)
    let platform: Platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight,
        broken: false,
        moveable: false,
        jetpack: false,
        trampoline: false 
    }

    platformArray.push(platform);

    let distanceBetweenPlatforms = 70; // Aetting Initial distance between platforms

    for (let i = 0; i < 6; i++) {
      let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); // (0-1) * boardWidth*3/4
      let isBroken =probability(200); // 2% chance of being a broken platform
      let isMoveable = probability(500); // 10% chance of being a moveable platform
      let isJetPack = probability(100); // 5% chance of being a moveable platform
      let isTrampoline = probability(200); // 10% chance of being a trampoline platform

      if (i === 0) {
          isBroken = false; // Ensure the first platform is not broken
          isMoveable = false; // Ensure the first platform is not moveable
          isJetPack=false; //Ensuring the first platform is not JetPack
          isTrampoline = false; //Ensuring the first platform is not Trampoline
      }
      platform = {
        img: isBroken ? brokenPlatformImg : platformImg,
        x: randomX,
        y: boardHeight - (distanceBetweenPlatforms * i) - 150,
        width: platformWidth,
        height: platformHeight,
        broken: isBroken,
        moveable: isMoveable,
        jetpack: isJetPack,
        trampoline: isTrampoline
    }

      platformArray.push(platform);

      // Increase distance between platforms as the score increases
      if (score > 1000) {
          distanceBetweenPlatforms = 100;
      }
      if (score > 2000) {
          distanceBetweenPlatforms = 125;
      }
      if (score > 3000) {
          distanceBetweenPlatforms = 150;
      }
  }
}

function newPlatform() {
  let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
  let isBroken = probability(200); // 20% chance of being a broken platform
  let isMoveable = probability(500); // 20% chance of being a moveable platform
  let isJetPack =probability(100); // 25% chance of being a moveable platform
  let isTrampoline = probability(100); // 25% chance of being a moveable platform
  let platform: Platform = {
      img: isBroken ? brokenPlatformImg : platformImg,
      x: randomX,
      y: -platformHeight,
      width: platformWidth,
      height: platformHeight,
      broken: isBroken,
      moveable: isMoveable,
      jetpack:isJetPack,
      trampoline:isTrampoline
  }

  platformArray.push(platform);
}


//All the collision detection logic

function detectCollision(a: Doodler, b: Platform): boolean {
  if (b.broken) {
      return false
  } else {
      // If the platform is not broken, perform regular collision detection
      return a.x <= b.x + b.width &&
          a.x + a.width >= b.x &&
          a.y <= b.y + b.height &&
          a.y + a.height >= b.y;
  }
}

function updateScore() {
  let points = Math.floor(50 * Math.random());
  if (velocityY < 0) { // Negative going up
      maxScore += points;
      if (score < maxScore) {
          score = maxScore;
      }
  } else if (velocityY >= 0) {
      maxScore -= points;
  }

  
 
}

// Define tilt sensitivity
const TILT_SENSITIVITY = 0.2; // Adjust as needed

// Variables to store tilt values
let tiltX: number = 0;
let tiltY: number = 0;

// Add event listener for device orientation change
window.addEventListener("deviceorientation", handleTilt);

// Function to handle device tilt
function handleTilt(event: DeviceOrientationEvent) {
  // Extract tilt values from the event
  tiltX = event.beta || 0; // Tilt along the X-axis (front-back motion)
  tiltY = event.gamma || 0; // Tilt along the Y-axis (left-right motion)

  // You may need to adjust the values based on the orientation of the device and desired sensitivity
  // Adjust the velocityX based on tiltY
  velocityX = tiltY * TILT_SENSITIVITY;

  // You may also want to map the tiltX and tiltY values to a specific range if needed
}

// Function to remove the tilt event listener when the game ends or when it's no longer needed
function removeTiltEventListener() {
  window.removeEventListener("deviceorientation", handleTilt);
}
