(function(){

    //canvas
    var music = document.querySelector('audio')
    
    window.addEventListener('DOMContentLoaded', ()=>{
      
    
        
        music.controls = false
        music.play()
        
        
        
      
      
      
    })

    var cnv = document.querySelector('canvas')
    //Contexto de rendererização 2d
    var ctx = cnv.getContext('2d')

    // Recursos do jogo
    // Arrys

    var sprites = [];
    var assetsToLoad = [];
    var missil = [];
    var aliens = [];
    
    var messages = [];
    
    //Variaveis uteis
    
    var alienFrequency = 100;
    var alienTimer = 0;
    var shots = 0;
    var hits = 0;
    var acuracy = 0;
    var scoreToIn = 50;
    var fire = 0;
    var exposion = 1;
    
  
    
    
    
    //sprites
    //cenário
    var background = new Sprite(0, 56, 400,500, 0, 0)
    sprites.push(background)


    //nave
    var defender = new Sprite(0, 0, 30, 50, 185, 440);
    sprites.push(defender)
    
    
    //mensagem da tela inicial
    var startMessage = 
    new ObjectMessage(cnv.height/2, "PRESS START", "#f00")
    
    
    //mensagem de pausa
    var pauseMessage = new ObjectMessage(cnv.height/2, "PAUSED", "#f00")
    
    
    var gameoverMessage =
    new ObjectMessage(cnv.height/2, "", "#f00")
    
    gameoverMessage.font = "normal bold 15px emulogic";
    
    gameoverMessage.visible = false;
    
    //placar
    var scoreMessage
    = new ObjectMessage(10, "", "#0f0")
    
    scoreMessage.font =
    
    "normal bold 15px emulogic"
    
    updateScore()
    
    messages.push(scoreMessage)
    
    pauseMessage.visible = false
    
    messages.push(pauseMessage)
    
    messages.push(startMessage)
    
    messages.push(gameoverMessage)
    
    
    
    //imagem

    var img = new Image();
    img.addEventListener('load',loadHandler, false)
    img.src = 'img/img.png'
    assetsToLoad.push(img)

    //contador de recursos

    var LoadedAssets = 0;

    //Entredas

    var left = 37, right = 39, enter = 13, space = 32;

    //Ações

    var mvLeft = mvRight = shoot = spaceIsDown = false;

    //Estados do jogo

    var loading = 0, playing = 1, paused = 2, over = 3;

    

    var gameState = loading;

    //Listeners

    var esquerda = document.getElementById('esquerda')
    var direita = document.getElementById('direita')
    var ss = document.getElementById('ss')
    
    var tiro = document.getElementById('circ')
    
    var x = document.getElementById('x')

/*
    window.addEventListener('keydown', function(e){
        var ck = e.keyCode
        if(ck === enter){

            ss.click();

        
        }

    })
    
    */

    //touch
    esquerda.addEventListener('touchstart', ()=>{
        mvLeft = true;
        
    }, false)

    direita.addEventListener('touchstart', ()=>{
        mvRight = true;
        
    }, false)
    
    esquerda.addEventListener('touchend', ()=>{
        mvLeft = false;
    }, false)

    direita.addEventListener('touchend', ()=>{
        mvRight = false;
    }, false)

    ss.addEventListener('touchend',()=>{
      
      music.play()
      

        if(gameState !== playing){
            gameState = playing
            startMessage.visible = false
            pauseMessage.visible = false

        } else{
            gameState = paused
            music.pause()
            pauseMessage.visible = true
        }     

    }, false)
    
    
    tiro.addEventListener('touchstart',()=>{
      
      shoot = true;
      
      
      if(!spaceIsDown){
        shoot = true
        spaceIsDown = true
      }
      
    })
    
    tiro.addEventListener('touchend',()=>{

        spaceIsDown = false
      
    })
    
    
    /*

    //mouse

    esquerda.addEventListener('mousedown', ()=>{
        mvLeft = true;
        
    }, false)

    direita.addEventListener('mousedown', ()=>{
        mvRight = true;
        
    }, false)
    
    esquerda.addEventListener('mouseup', ()=>{
        mvLeft = false;
    }, false)

    direita.addEventListener('mouseup', ()=>{
        mvRight = false;
    }, false)

    ss.addEventListener('mousedown',()=>{

        if(gameState !== playing){
            gameState = playing

        } else{
            gameState = paused
        }     
        

    }, false)


    window.addEventListener('keydown', function(e){
        var key = e.keyCode
        

        switch(key){
            case left:
                mvLeft = true
                break;
            case right:
                mvRight = true
                break;
                    




        }



    }, false)

    window.addEventListener('keyup', function(e){
        var key = e.keyCode
        

        switch(key){
            case left:
                mvLeft = false
                break;
            case right:
                mvRight = false
                break;
            case enter:
                if(gameState !== playing){
                    gameState = playing

                } else{
                    gameState = paused
                }     



        }



    }, false) 

*/

    //Funções

    function loadHandler(){
        LoadedAssets++;
        if(LoadedAssets === assetsToLoad.length){
            img.removeEventListener('load', loadHandler, false)
            // Inicia o jodo
            gameState = paused;
        }
    }

    function loop(){
        window.requestAnimationFrame(loop, cnv)

        //Define as ações com base no estado do jogo

        switch(gameState){
            case loading:
                console.log('Loading')
                break;
            case playing:
                update()
                break;
            case over:
              endGame()
              break;
        }
        render()
    }

    function update(){
        if(mvLeft && !mvRight){
            defender.vx = -5
        }

        if(mvRight && !mvLeft){
            defender.vx = 5
        }

        if(!mvLeft && !mvRight){

            defender.vx = 0;

        }
        
        //Dispara canhão
        
        if(shoot){
          fireMissil()
          shoot = false
        }
        
        
        defender.x = Math.max(0, Math.min(cnv.width - defender.width, defender.x + defender.vx))
        
        
        
        // Atualiza a posição dos misseis
        for(var i in missil){
          var missile = missil[i]
          missile.y += missile.vy
          if(missile.y < missile.height){
            removeObjetcs(missile, missil)
            removeObjetcs(missile,sprites)
            updateScore()
            i--;
            
          }
        }
        
        //Encremento do alienTimer
        alienTimer++
        
        
        //criação do alien caso o timer iguale a frequencia
        
        if(alienTimer === alienFrequency){
          
          makeAlien()
          alienTimer = 0;
          //Ajuste na frequencia de criação de aliens
          if(alienFrequency > 50){
            
            alienFrequency--;
            
            
          }
        }
        
        
        
        //Move os aliens
        for(var i in aliens){
          var alien = aliens[i]
          
        if(alien.state !== alien.exploded)
        
            alien.y += alien.vy
          if(alien.state === alien.crazy){
            if(alien.x > cnv.width - alien.width || alien.x < 0){
              alien.vx *= -1;
            }
           alien.x += alien.vx
          }
          //confere se algum alien chegou a terra
          if(alien.y > cnv.height - alien.height){
            gameState = over;
          }
          
          
          //Confere se algum alien colidiu com a nave
          if(collide(alien, defender)){
            
            destroyAlien(alien)
            playSound(exposion)
            removeObjetcs(defender,sprites)
            gameState = over;
            
            
          }
          
          
          
          //Confere se algum alien foi destruido
          for(var j in missil){
            var missile = missil[j]
            if(collide(missile, alien) && alien.state !== alien.exploded){
              destroyAlien(alien)
              hits++
              updateScore()
              
              if(parseInt(hits) === scoreToIn){
                
                gameState = over
                
                // Destroi todos os aliens
                for(var k in aliens){
                  
                  alienk = aliens[k]
                  
                  destroyAlien(alienk)
                  
                }
                
              }
              
              removeObjetcs(missele, missil)
              removeObjetcs(missele, sprites)
              
              i--
              j--
            }
          }
          
        }//Fim da movimentação dos aliens
        
    }
    
    //criação dos misseis
    
    function fireMissil(){
      var missile = new Sprite(136, 12, 8, 13, defender.centerX() - 4, defender.y - 13)
      missile.vy = -8
      sprites.push(missile)
      missil.push(missile)
      
      playSound(fire)
      
      shots++
    }
    
    //Criação de aliens
    
    function makeAlien(){
      //Cria um valor aleatório entre 0 e 7 (largura do canvas / largura alien) divide o canvas em 8 colunas para o posicionamento aleatório do alien
      var alienPosition =
      (Math.floor(Math.random() * 8)) * 50
      var alien = 
      new Alien(30, 0, 50, 50, alienPosition, -50)
      
      alien.vy = 0.5;
      
      //Otimização do alien
      
      if(Math.floor(Math.random() * 11) > 7){
        
        alien.state = alien.crazy
        
        alien.vx = 1;
        
      }
      
      if(Math.floor(Math.random() * 11) > 5){
        alien.vy = 1
      }
    
      
      
      
      
      sprites.push(alien)
      aliens.push(alien)
      
    }
    
    //destroi aliens
    
    function destroyAlien(alien){
      alien.state = alien.exploded
      alien.explode()
      playSound(exposion)
      setTimeout(function() {
        
        
        
        removeObjetcs(alien,aliens)
        removeObjetcs(alien, sprites)
        
      }, 1000);
    }
    
    //Remove os objetos do Jogo
    
    function removeObjetcs(ObjectToRemove, array){
      
      var i = array.indexOf(ObjectToRemove)
      
      if(i !== -1){
        array.splice(i,1)
      }
      
    }
    
    
    function updateScore(){
      
      //calculo do aproveitamento
      if(shots === 0){
        
        acuracy = 100;
        
      } else{
        
        acuracy = 

        

        Math.floor((hits / shots) * 100)
        
        
      }
      
      //ajuste no texto aproveitamento
      
      if(acuracy > 100){
        acuracy = 100
      }
      
      if(acuracy < 100){
        acuracy = acuracy.toString()
        if(acuracy.length < 2){
          acuracy = "  " + acuracy;
        } else{
          
          acuracy = " " + acuracy;
          
        }
        
        
      }
      
      //Ajuste no texto HITS
      hits = hits.toString()
      if(hits.length < 2){
        hits = "0" + hits;
      }
        
      
      
      scoreMessage.text =
      "HITS: " + hits + " - ACURACY: " +
      acuracy + "%";
      
      
      
    }
    
    
    function endGame(){
      
      if(hits < scoreToIn){
        
        gameoverMessage.text = "A TERRA FOI DESTRUÍDA!"
      } else{
        
        gameoverMessage.text = `VITÓRIA!! A TERRA FOI SALVA`
        
        gameoverMessage.color = "#00f"
        gameoverMessage.font =
        "normal bold 10px emulogic"
        
      }
      gameoverMessage.visible = true
      
      setTimeout(function(){
        
        location.reload();
        
        
      }, 3000)
      
      
    }
    
    
    //Efeitos sonoros do Jogo
    
    function playSound(soundType){
      
      var sound = document.createElement('audio')
      if(soundType === exposion){
        
        sound.src = "../sound/explosion.mp3"
        
      } else{
        
        sound.src = "../sound/fire.mp3"
        
        
      }
      
      sound.addEventListener('canplaythrough',()=>{
        
        sound.play()
        
      },false)
      
    }
    
    
    

    function render(){
        ctx.clearRect(0,0,cnv.width,cnv.height)
        //exibe os sprites na tela
        if(sprites.length !== 0){

            for(var i in sprites){
                var spr = sprites[i]

                ctx.drawImage
                (   
                    //captura
                    img, spr.srcX, spr.srcY, spr.width, spr.height,

                    //exibição
                    Math.floor(spr.x), Math.floor(spr.y), spr.width, spr.height
                    
                    )
            }

        }
        //exibe os textos
        if(messages.length !== 0){
          
          for(var i in messages){
            
            var message = messages[i]
            if(message.visible){
              ctx.font = message.font
              ctx.fillStyle = message.color
              ctx.textBaseline = message.baseline
              
              message.x = (cnv.width - ctx.measureText(message.text).width)/2
              ctx.fillText(message.text, message.x, message.y)
            }
            
            
          }
          
          
        }
        
    }

    loop()
    
  

}())


