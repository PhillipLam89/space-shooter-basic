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
      x:1 ,y:0
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
const invaderProjectiles = []
const keys = {//monitors keys pressed
  a: {pressed:false},
  d: {pressed:false},
  space: {pressed: false}
}
let bulletCount = 15
let spamCount = 0
let frames = 0
let hits = 0
let randomInterval = ~~(Math.random() * 500) + 500
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'darkgrey'
  c.fillRect(0,0, canvas.width, canvas.height)

  player.update()
  invaderProjectiles.forEach((projectile,index) => {
    if (projectile.position.y + projectile.height >= canvas.height) {
      setTimeout(() => {
        invaderProjectiles.splice(index,1)
      },0)
    } else projectile.update()
    if (projectile.position.y + projectile.height >= player.position.y
        && projectile.position.x + projectile.width <= player.position.x + player.width
        && projectile.position.x + projectile.width >= player.position.x) {
          //hits player if x & y coords match the players current position
          invaderProjectiles.splice(index,1) //prevents bullet from hitting you more than once

    }
  })


  projectiles.forEach((projectile, i) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(i,1)
      },0)
    } else projectile.update()
  })

  grids.forEach((grid, gridIndex) => {
    grid.update()
    //spawns invader projectiles
    if (frames % 200 === 0 && grid.invaders.length) {
      grid.invaders[~~(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }
    // if (frames % 340 === 0 && grid.invaders.length) {
    //   grid.invaders[~~(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    // }
    grid.invaders.forEach((invader,i) => {
      invader.update({velocity:grid.velocity})
      projectiles.forEach((projectile,j) => {
        if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y)
             {
           setTimeout(() => {
              const invaderFound = grid.invaders.find(invader2 =>invader2 === invader)
              const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
              // removes projectile & the corresponding enemy that it hits
              if (invaderFound && projectileFound) {
                grid.invaders.splice(i,1)
                projectiles.splice(j,1)
                if (grid.invaders.length) {
                  const firstInvader = grid.invaders[0]
                  const lastInvader = grid.invaders[grid.invaders.length - 1]

                  grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                  grid.position.x = firstInvader.position.x
                } else {
                    //removes empty arrays (groups) of enemies that have all been killed (memory efficient)
                    grids.splice(gridIndex,1)
                }
              }

           })
        }
      })
    })

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
      // prevents unlimited ammo
      // if (!bulletCount) return
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
      keys.space.pressed = true
      bulletCount--
      !bulletCount && setTimeout(() => bulletCount = 15, 3000)
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
      keys.space.pressed = false
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
