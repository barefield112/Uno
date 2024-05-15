// Initialize all varibles
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
const cardColors = ["red", "blue", "green", "yellow"];
const cardValues = ['0','1','2','3','4','5','6',
'7','8','9','+2','↻','Ø', 'wild'];
const wildCardValues = ['W', '+4'];
const cardWidth = 60;
const cardHeight = 80;

class Player{

    constructor(name, cards, x, y, turnID){
        this.name = name;
        this.cards = cards;
        this.x = x;
        this.y = y;
        this.turnID = turnID;
    }
}

let player = new Player ("You", [], 50, 350, 0);
let bot1 = new Player ("Bot 1", [], 50, 50, 1);
let bot2 = new Player ("Bot 2", [], 380, 50, 2);

const playerCardsOffset = 25;

const botCardsOffset = 10;
const deckX = 300;
const deckY = 185;
const stackX = (250-cardWidth/2);
const stackY = (225-cardHeight/2);
let randomColor = 'white';
let randomValue = '0';
let playerCards = [];
let bot1Cards = [];
let bot2Cards = [];
let shownCard = {value: '0', color:'red'};
let playerTurn = true;
let initalDealComplete = false;
let turnNum = 0;
let skip = false;
let target = 'bot1';
let direction = 1; //Clockwise direction, negative will make counter clockwise
let wildColorPick = false;


dealCards('person');
dealCards('bot1');
dealCards('bot2');
initalDealComplete = true;
firstCardSet();
drawDisplay();

canvas.addEventListener('click', function(event){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    if(playerCards.length > 0 && playerTurn && !wildColorPick){
        const playerCardsLength = player.x + 
        (playerCardsOffset* (playerCards.length -1)+ cardWidth)
        if((x >= player.x)&&
        (x<= playerCardsLength)&&
        (y>= player.y)&&
        (y<= player.y + cardHeight)){
            
        let index = 0;
        if(x>= playerCardsLength - cardWidth){
            index = playerCards.length - 1;
        }
        else{
            index = (Math.ceil((x - player.x) / playerCardsOffset)) - 1;  
        }
        
        if(validSelection('person', index)){
            placeCard('person', index);
            if(!wildColorPick){
                playerTurn = false;
                trackTurn();
            }
        }
       }
       else if(x >= deckX &&
        x <= deckX + cardWidth &&
        y>= deckY&&
        y<= deckY + cardHeight){
            drawNewCard('person');
            drawDisplay();
            if(!wildColorPick){
                playerTurn = false;
                trackTurn();
            }
       }
    }
    else if(wildColorPick){
        if(x >= stackX - cardWidth- 10 &&
            x <= stackX -10 &&
            y>= stackY &&
            y<= deckY + cardHeight){
                shownCard.color = 'red';
                wildColorPick = false;
                trackTurn();
                drawDisplay();
        }
        else if(x >= stackX + cardWidth+  10 &&
            x <= stackX + cardWidth + cardWidth+ 10 &&
            y>= stackY &&
            y<= deckY + cardHeight){
                shownCard.color = 'blue';
                wildColorPick = false;
                trackTurn();
                drawDisplay();
        }
        else if(x >= stackX &&
            x <= stackX +cardWidth &&
            y>= stackY - cardHeight - 10&&
            y<= deckY - 10){
                shownCard.color = 'yellow';
                wildColorPick = false;
                trackTurn();
                drawDisplay();
        }
        else if(x >= stackX &&
            x <= stackX +cardWidth &&
            y>= stackY + cardHeight+ 10 &&
            y<= deckY + cardHeight + cardHeight+10){
                shownCard.color = 'green';
                wildColorPick = false;
                trackTurn();
                drawDisplay();
        }
        else{
            console.log("no")
        }
        
    }
    
})

function checkForWin(player){
    if(player.length == 0){
        let display = "";
        if(player == playerCards){
            display = "You Win";
        }
        else if(player == bot1Cards){
            display = "Bot 1 Wins";
        }
        else if(player == bot2Cards){
            display = "Bot 2 Wins";
        }
        window.alert(display + "! Game Over");
        window.close();
    }
}

function checkForUno(player){
    if(player.length == 1){
        let display = "";
        if(player == playerCards){
            display = "You";
        }
        else if(player == bot1Cards){
            display = "Bot 1";
        }
        else if(player == bot2Cards){
            display = "Bot 2";
        }
        window.alert( display +'~ "UNO"');
    }
}

function checkForSpecialCard(player){
    switch(shownCard.value){
    case '↻':
        console.log("placed a reverse");
        direction = -direction;
        break;
    case '+2':
        console.log("placed a draw 2");
        skip = true;
        drawNewCard(target);
        drawNewCard(target);
        break;
    case 'Ø':
        console.log("placed a skip");
        skip = true;
        break;
    case '+4':
        console.log("placed a +4");
        skip = true;
        drawNewCard(target);
        drawNewCard(target);
        drawNewCard(target);
        drawNewCard(target);
        if(player == playerCards){
            wildColorPick = true;
        }
        else{
            botWildSelect(player);
        }
        break;
    case 'W':
        console.log("placed a Wild");
        if(player == playerCards){
            wildColorPick = true;
        }
        else{
            botWildSelect(player);
        }
        break;
    default:
        break;
    }
    drawDisplay();
    
   function botWildSelect(player){
        if(player == bot1Cards){
            shownCard.color = bot1Cards[0].color;
            if(shownCard.color == "black"){
                shownCard.color = cardColors[Math.floor
                    (Math.random() * cardColors.length)]; 
            }
        }
        else if (player == bot2Cards){
            shownCard.color = bot2Cards[0].color;
            if(shownCard.color == "black"){
                shownCard.color = cardColors[Math.floor
                    (Math.random() * cardColors.length)]; 
            }
        }
   }
}

function trackTurn(){
    let foundValid = false;
    turnNum = turnNum + direction;
    if(turnNum> 2){
        turnNum = 0;
        playerTurn = true;
    }
    else if(turnNum < 0){
        turnNum = 2;
    }

    if(skip){
        skip = false;
        turnNum = turnNum + direction;
        if(turnNum> 2){
            turnNum = 0;
            playerTurn = true;
        }
        else if(turnNum < 0){
            turnNum = 2;
    }
    }
    console.log(turnNum);
    drawDisplay();
    switch(turnNum){
        case 0:
            playerTurn = true;
            break;
        case 1: 
            setTimeout(bot1Turn, 3000);
            break;
        case 2:
            setTimeout(bot2Turn, 3000);
            break;
        default:
            console.log("error in turnTrack")
        
    }
    target = turnNum + direction;
    if(target> 2){
        target = 0;
    }
    else if(target < 0){
        target= 2;
    }
    switch(target){
        case 0:
            target = 'person';
            break;
        case 1: 
            target = 'bot1';
            break;
        case 2:
            target = 'bot2';
            break;
        default:
            console.log("error in turnTrack")
        
    }


    

    function bot1Turn(){
        console.log("bot 1 turn started");
      for(let i = 0; i < bot1Cards.length; i++){
        foundValid = validSelection('bot1', i);
        if(foundValid == true){
            placeCard('bot1', i);
            foundValid = false;
            drawDisplay();
            break;
        }
        else if(i == (bot1Cards.length -1 )){
            drawNewCard('bot1');
            drawDisplay();
            break;
        }
      }
      trackTurn();
    }
    function bot2Turn(){
        console.log("bot 2 turn started");
        for(let i = 0; i < bot2Cards.length; i++){
          foundValid = validSelection('bot2', i);
          
          if(foundValid == true){
              placeCard('bot2', i);
              foundValid = false;
              drawDisplay();
              break;
          }
          else if(i == (bot2Cards.length - 1)){
              drawNewCard('bot2');
              drawDisplay();
              break;
          }
        }
        trackTurn();
      }
}

function drawNewCard(player){
    randomValue = cardValues[Math.floor
        (Math.random() * cardValues.length)];
        if(randomValue =='wild'){
            randomColor = 'black'
            randomValue = wildCardValues[Math.floor
            (Math.random() * wildCardValues.length)];
        }
        else {
            randomColor = cardColors[Math.floor
            (Math.random() * cardColors.length)];   
        }
        console.log(`${player} Draws Card`);
        switch(player){
            case 'person':
                playerCards.push({value: randomValue, color: randomColor});
                if(validSelection(player, (playerCards.length - 1) ) && initalDealComplete && !skip){
                    console.log(`${player} places drawn card`);
                    placeCard(player,playerCards.length-1);
                }
                break;
            case 'bot1':
                bot1Cards.push({value: randomValue, color: randomColor});
                if(validSelection(player,(bot1Cards.length-1)) && initalDealComplete && !skip){
                    console.log(`${player} places drawn card`);
                    placeCard(player,bot1Cards.length-1);
                }
                break;
            case 'bot2':
                bot2Cards.push({value: randomValue, color: randomColor});
                if(validSelection(player, (bot2Cards.length-1)) && initalDealComplete && !skip){
                    console.log(`${player} places drawn card`);
                    placeCard(player,bot2Cards.length-1);
                }
                break;
            default:
                break;
        }
        drawDisplay();
}

function placeCard(player, index){
    switch(player){
        case 'person':
            shownCard = playerCards[index];
            playerCards.splice(index, 1);
            console.log(`${player} places a 
            ${shownCard. color} ${shownCard.value}`);
            player = playerCards;
            break;
        case 'bot1':
            shownCard = bot1Cards[index];
            bot1Cards.splice(index, 1);
            console.log(`${player} places a 
             ${shownCard. color} ${shownCard.value}`);
            player = bot1Cards;
            break;
        case 'bot2':
            shownCard = bot2Cards[index];
            bot2Cards.splice(index, 1);
            console.log(`${player} places a 
            ${shownCard. color} ${shownCard.value}`);
            player = bot2Cards;
            break;
        default:
            break;
            
    }
    drawDisplay();
    checkForSpecialCard(player);
    setTimeout(() =>{
        checkForUno(player);
        checkForWin(player);
    }, 200);
}

function validSelection(player, index){
    let pickedCard = {};
    switch(player){
        case 'person':
            pickedCard = playerCards[index];
            break;
        case 'bot1':
            pickedCard = bot1Cards[index];
            break;
        case 'bot2':
            pickedCard = bot2Cards[index];
            break;
        default:
            break;
    }
    if(shownCard.color == pickedCard.color){
        return true;
    }
    else if(shownCard.value == pickedCard.value){
        return true;
    }
    else if (pickedCard.value == "W"){
        return true;
    }
    else if (pickedCard.value == "+4"){
        return true;
    }
    else{return false;}
}

function firstCardSet(){
    const startValues = ['0','1','2','3','4','5','6',
    '7','8','9'];
    randomValue = startValues[Math.floor
        (Math.random() * startValues.length)];
    randomColor = cardColors[Math.floor
        (Math.random() * cardColors.length)];
        shownCard = ({value: randomValue, color: randomColor});
}

function dealCards(player){
    for(let i = 0; i<7; i++){
        drawNewCard(player);
    }
}

function drawDisplay(){ //This fuction draws the display
    // Draws the main board
    context.fillStyle = "green";
    context.fillRect(0,0, canvas.width, canvas.height );
    // Draws the person players cards
    context.font = " bold 16px Arial";
    let offset = 0;
    playerCards.forEach(card => {
        drawFaceUpCard(player.x,player.y,card.value,card.color);
        });
    offset = 0;
    bot1Cards.forEach(card => {
        //drawFaceUpCard(bot1.x,bot1.y,card.value,card.color);
        drawFaceDownCard(bot1.x, bot1.y);
        });     
    offset = 0;
    bot2Cards.forEach(card => {
        //drawFaceUpCard(bot2.x,bot2.y,card.value,card.color);
        drawFaceDownCard(bot2.x, bot2.y);
        });        
    offset = 0;
    const firstCard =shownCard;
    drawFaceUpCard(stackX,stackY,firstCard.value,firstCard.color);
    offset = 0;
    drawFaceDownCard(deckX, deckY);

    switch(turnNum){
            case 0:
                drawChip(100, 300);
                break;
            case 1: 
                drawChip(100, 160);
                break;
            case 2:
                drawChip(400, 160);
                break;
            default:
                console.log("error drawing chip")
    }
    if(wildColorPick){
        drawWildColorPicker();
    }


    function drawFaceUpCard(x, y, value, color){
            context.fillStyle = color;
            context.strokeStyle = "white";
            context.lineWidth = 3;
            context.fillRect( //Draws card
                (x + offset), y,
                cardWidth,
                cardHeight);
            context.strokeRect( //Draws white border
                (x+ offset),y,
                cardWidth,
                cardHeight);
            context.fillStyle = "white";
            context.fillText(// Draws corner text
                value, 
                x + 6 + offset, 
               y+ 18);
            context.beginPath();
            // Draw an ellipse
            // context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
            context.ellipse(
                (x+ 30+offset), 
                (y + 40 ),
                20,
                40,
                (2*Math.PI)/8 ,
                0,
                2 * Math.PI);
            context.fill();
            offset = offset +  playerCardsOffset;
    }
    function drawFaceDownCard(x, y){
        context.fillStyle = "black";
        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.fillRect( //Draws card
        (x + offset), y,
        cardWidth,
        cardHeight);
        context.strokeRect( //Draws white border
        (x+ offset),y,
        cardWidth,
        cardHeight);
        context.fillStyle = "red";
        context.beginPath();
            // Draw an ellipse
            // context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
            context.ellipse(
                (x+ 30+offset), 
                (y + 40 ),
                20,
                32,
                (2*Math.PI)/8 ,
                0,
                2 * Math.PI);
            context.fill();
        offset += botCardsOffset;
    }
    function drawChip(x,y){
        context.beginPath();

        // Draw the circle
        // ctx.arc(x, y, radius, startAngle, endAngle)
        context.arc(x, y, 10, 0, 2 * Math.PI);

        // Style the circle (optional)
        context.fillStyle = 'red';
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
    }
    function drawWildColorPicker(){
        context.fillStyle = "hsla(0, 0%, 18%, 0.5)";
        context.fillRect(0,0, canvas.width, canvas.height );
        offset = 0;
        drawFaceUpCard(stackX- cardWidth- 10, stackY ,shownCard.value,'red');
        offset = 0;
        drawFaceUpCard(stackX+ cardWidth + 10, stackY ,shownCard.value,'blue');
        offset = 0;
        drawFaceUpCard(stackX, stackY -cardHeight - 10,shownCard.value,'yellow');
        offset = 0;
        drawFaceUpCard(stackX, stackY +cardHeight + 10,shownCard.value,'green');
    }
}

