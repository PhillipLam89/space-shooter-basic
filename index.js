const canvas =
document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
  constructor() {
    this.velocity = {x: 0, y:0}
    this.rotation = 0
    const image = new Image()
    image.src = './resources/spaceship.png'
    image.onload = () => {
      this.image = image
      const scale = .15
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
          this.radius, 0, Math.PI*2)
    c.fillStyle = 'red'
    c.fill()
    c.closePath()
  }
  update() {
    this.draw()
    this.position.x+= this.velocity.x
    this.position.y+= this.velocity.y
  }
}
const player = new Player()

const projectiles = []

const keys = {//monitors keys pressed
  a: {pressed:false},
  d: {pressed:false},
  space: {pressed: false}
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'goldenrod'
  c.fillRect(0,0, canvas.width, canvas.height)
  player.update()

  projectiles.forEach(projectile => {
    projectile.update()
  })

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -3
    player.rotation = -0.25
  }else if (keys.d.pressed && (player.position.x + player.width <= canvas.width)) {
    player.velocity.x = 3
    player.rotation = 0.25
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }
}
animate()

window.addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      keys.a.pressed = true
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      keys.d.pressed = true
      break;
    case ' ':
      const newProjectile = new Projectile({
        position: { //where each particle spawning x,y coords are
          x:player.position.x + (player.width * .5),
          y:player.position.y
        },
        velocity: {//speed & direction of fall
          x:0,
          y:-5
        }
      })
      projectiles.push(newProjectile)
      break;
  }
})
window.addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      keys.a.pressed = false
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      keys.d.pressed = false
      break;
    case ' ':
      console.log('fired shot!')
      keys.space.pressed = true
      break;
  }
})
