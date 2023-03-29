function Sprite(srcX, srcY, width, height, x, y){

    this.srcX = srcX
    this.srcY = srcY
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    
    this.vx = 0;
    this.vy = 0;
}

Sprite.prototype.centerX = function(){
    return this.x + (this.width / 2)

}

Sprite.prototype.centerY = function(){
    return this.y + (this.height / 2)
}

Sprite.prototype.halfWidth = function(){
    return this.width / 2
}

Sprite.prototype.halfHeight = function(){
    return this.height / 2
}

var Alien = function(srcX, srcY, width, height, x, y){
  
  Sprite.call(this, srcX, srcY, width, height, x, y)
  this.normal = 1;
  this.exploded = 2;
  this.crazy = 3;
  this.state = this.normal
  this.mvStyle = this.normal
  
  
}

Alien.prototype = 

Object.create(Sprite.prototype)

Alien.prototype.explode = function(){
  
  this.srcX = 80;
  this.width = this.height = 56;
}

var ObjectMessage = function(y, text, color){
  
  this.x = 0;
  this.y = y;
  this.text = text;
  this.visible = true;
  this.font = "normal bold 20px emulogic";
  this.color = color;
  this.baseline = "top"
  
  
  
}