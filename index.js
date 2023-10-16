const canvas =
document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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
    const newX =
      player.position.x + player.width / 2
    const newY =
       player.position.y + player.height / 2

    c.save()//saves current coordinates of canvas
    c.translate(newX,newY) //moves canvas to middle of air-plane, new coords created
    c.rotate(this.rotation) //rotate whole canvas + plane (new rotation state)
    c.translate(-newX, -newY) //moves canvas back to original coords, cancels out previous translate


    c.drawImage(this.image, this.position.x,
      this.position.y,this.width, this.height)
    c.restore()//restores OG coords, we will still see plane as tilted
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
    this.radius = 3
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
}

class Grid {
  constructor() {
    this.position = {
      x:0,y:0
    }
    this.velocity = {
      x:1,y:0
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
const player = new Player('https://civilengineering-softstudies.com/wp-content/uploads/2021/06/spaceship_red.png')

const projectiles = []
const grids = []
const keys = {//monitors keys pressed
  a: {pressed:false},
  d: {pressed:false},
  space: {pressed: false}
}

let spamCount = 0
let frames = 0
let randomInterval = ~~(Math.random() * 500) + 500
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'darkgrey'
  c.fillRect(0,0, canvas.width, canvas.height)

  player.update()

  projectiles.forEach((projectile, i) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => projectiles.splice(i,1),0)
    } else projectile.update()
  })

  grids.forEach(grid => {
    grid.update()
    grid.invaders.forEach(invader =>
      invader.update({velocity: grid.velocity}))
  })

  if (keys.a.pressed && player.position.x >= 0) {

    player.velocity.x = -2 - spamCount //increases movement speed on key hold
    player.rotation = -0.25
  }else if (keys.d.pressed && (player.position.x + player.width <= canvas.width)) {
    player.velocity.x = 3 + spamCount //increases movement speed on key hold
    player.rotation = 0.25
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }
  if (frames % randomInterval === 0) {
    grids.push(new Grid())
    //will generate a group of enemies at random time intervals
    //re-assigning randomInterval will make sure every group is generated at a random time
    randomInterval = ~~(Math.random() * 500) + 500
    frames = 0
  }
  frames++
}
animate()

window.addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      spamCount+= 0.20
      keys.a.pressed = true
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      spamCount+= 0.25
      keys.d.pressed = true
      break;
    case ' ':

      const generatedBullet = new Projectile({
        position: { //where each particle spawning x,y coords are
          x:player.position.x + (player.width * .5),
          y:player.position.y
        },
        velocity: {//speed & direction of bullets
          x:0,
          y:-3
        }
      })
      projectiles.push(generatedBullet)
      break;
  }
})
window.addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      spamCount = 0
      keys.a.pressed = false
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      spamCount = 0
      keys.d.pressed = false
      break;
    case ' ':
      console.log('fired shot!')
      keys.space.pressed = true
      break;
  }
})


window.onresize = () =>
{
  canvas.width = window.innerWidth
  player.position.x =
        0.5*(canvas.width - player.width)
  player.draw()
}
