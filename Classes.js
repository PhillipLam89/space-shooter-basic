class Player {
  constructor(imgURL) {
    this.velocity = {x: 0, y:0}
    this.rotation = 0
    const image = new Image()
    image.src = imgURL ||
         './resources/spaceship.png'
    image.onload = () => {
      this.image = image
      const scale = .10
      this.width = image.width * scale
      this.height= image.height * scale
      this.position = {
        x: canvas.width * .5 - this.width *.5,
        y: canvas.height - this.height - 20
      }
    }
  }
  draw() {
    // const newX =
    //   player.position.x + player.width / 2
    // const newY =
    //    player.position.y + player.height / 2

    // c.save()//saves current coordinates of canvas
    // c.translate(newX,newY) //moves canvas to middle of air-plane, new coords created
    // c.rotate(this.rotation) //rotate whole canvas + plane (new rotation state)
    // c.translate(-newX, -newY) //moves canvas back to original coords, cancels out previous translate


    c.drawImage(this.image, this.position.x,
      this.position.y,this.width, this.height)
    // c.restore()//restores OG coords, we will still see plane as tilted
  }
  update() {
    if(this.image) {
      this.draw()
      this.position.x+= this.velocity.x
    }
  }
}
class Projectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 2
  }
  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y,
          this.radius, 0, Math.PI * 2)
    c.fillStyle = 'blue'
    c.fill()
    c.closePath()
  }
  update() {
    this.draw()
    this.position.x+= this.velocity.x
    this.position.y+= this.velocity.y
  }
}
class ParticleExplosion {
  constructor({position, velocity, radius,color}) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
  }
  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y,
          this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }
  update() {
    this.draw()
    this.position.x+= this.velocity.x
    this.position.y+= this.velocity.y
  }
}
class Invader {
  constructor({imgURL, position}) {
    this.velocity = {x: 0, y:0}

    const image = new Image()
    image.src = imgURL ||
         './resources/invader.png'
    image.onload = () => {
      this.image = image
      const scale = 1
      this.width = image.width * scale
      this.height= image.height * scale
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }
  draw() {
    c.drawImage(this.image, this.position.x,
    this.position.y,this.width, this.height)
  }
  update({velocity}) {
    if(this.image) {
      this.draw()
      this.position.x+= velocity.x
      //invade must also move downwards (Y-direction)
      this.position.y+= velocity.y
    }
  }
  shoot(invaderProjectilesArr) { //takes an array of projectiles
    invaderProjectilesArr.push(new InvaderProjectile(
    {
      position: {x: this.position.x + this.width*0.5,
                  y: this.position.y + this.height},
      velocity: {x: 0, y:4}
    }
    ))

    }
}
class InvaderProjectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.width = 3
    this.height = 10
  }
  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x,
               this.position.y,
               this.width,
               this.height)
  }
  update() {
    this.draw()
    this.position.x+= this.velocity.x
    this.position.y+= this.velocity.y
  }
}
class Grid {
  constructor() {
    this.position = {
      x:0,y:0
    }
    this.velocity = {
      x:2 ,y:0
    }
    this.invaders = []

    const rows = ~~(Math.random() * 5 + 2) //height
    const columns = ~~(Math.random() * 7  + 4) //width

    this.width = columns * 30

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(new Invader({
          position : {x: x * 30,y: y * 30}
        }))
      }
    }
  }
  update() {
    this.position.x+= this.velocity.x
    this.position.y+= this.velocity.y
    this.velocity.y = 0
    if (this.position.x + this.width
          >= canvas.width ||
          !this.position.x) {
      this.velocity.x*= -1 //bounces invaders once they hit wall
      this.velocity.y = 20
    }
  }
}
