const canvas =
document.querySelector('canvas')
const c = canvas.getContext('2d')


const loserSound = new Audio('./resources/audio/loserSound.mp3')

const score = document.getElementById('scorePoints')

canvas.width = window.innerWidth
canvas.height = window.innerHeight


const player = new Player('https://civilengineering-softstudies.com/wp-content/uploads/2021/06/spaceship_red.png')
// const player = new Player()

const projectiles = []
const grids = []
const invaderProjectiles = []
const keys = {//monitors keys pressed
  a: {pressed:false},
  d: {pressed:false},
  space: {pressed: false}
}
let bulletCount = 20
bulletsCountDiv.textContent = bulletCount
let spamCount = 0
let frames = 0
let hits = 0
const particles = []
let randomInterval = ~~(Math.random() * 500) + 500
let game = {
  over: false,
  active: true
}


function createParticles({object,color}, explodsionPieces = 5, initX = 0, initY = 0) {
  for (let i = 0; i < explodsionPieces; i++) {
  particles.push(new ParticleExplosion({
    position: {x: initX + object.position.x + object.width * .5,
              y: initY + object.position.y + object.height * .5
              },
    velocity: {
              x: (Math.random() -.5)*2,
              y: (Math.random() -.5)*2
              },
    radius: Math.random() * 5.5,
    color: color || 'chartreuse'
  }))
    //setTime allows particles to be erased a few secs after exploding!
    setTimeout(() => particles.splice(i,explodsionPieces), ~~(Math.random() * 2000) + 1000)
  }
}



let msPrev = window.performance.now()
const fps = 60
const msPerFrame = 1000 / fps

function animate() {
  if (!game.active) return
  requestAnimationFrame(animate)
  
// //this makes the code below run smoothly for 60FPS monitors AND higher FPS gaming-minitors :D
const msNow = window.performance.now()
const msPassed = msNow - msPrev

if (msPassed < msPerFrame) return

 msPrev = msNow
//   //this makes the code above  run smoothly for 60FPS monitors AND higher FPS gaming-minitors :D
  
  c.fillStyle = 'black'
  c.fillRect(0,0, canvas.width, canvas.height)
  galacticBackgroundStars(2)
  if (starsArray) {
    starsArray.forEach(star => star.update())

  }
  //renders stars in background fallin


  player.update()
  particles.forEach(particleExplosion => particleExplosion.update())
  invaderProjectiles.forEach((projectile,index,arr) => {
    if (projectile.position.y + projectile.height >= canvas.height) {
      setTimeout(() => {
        invaderProjectiles.splice(index,1)

      },0)
    } else projectile.update()
    if (projectile.position.y + projectile.height >= player.position.y
        && projectile.position.x + projectile.width <= player.position.x + player.width
        && projectile.position.x + projectile.width >= player.position.x) {
          //hits player if x & y coords match the players current position
          // arr.splice(index,1) //prevents bullet from hitting you more than once
          createParticles({
            object: player,
            color: 'red'
          },5,20, -player.height)
          player.opacity = 0
          game.over = true
          canvas.style.opacity = 0
          loserSound.play()

          setTimeout(() => {
            canvas.remove()
            document.body.innerHTML = `<h5>YOU LOST YOU SUCK! THANKS FOR PLAYING MR.PHILIP'S GAME! </h5>
                                       <h2>Score: ${score.textContent} Points!</h2>`
            document.body.classList.add('gameLost')
            loserSound.muted = 'muted'

          }, 2400)
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

    if ( frames % 200 === 0 ||
         frames % 200 === 1 && grid.invaders.length) {
      grid.invaders[~~(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }

    grid.invaders.forEach((invader,i) => {
      invader.update({velocity:grid.velocity})
      projectiles.forEach((projectile,j) => {
        if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y)
          {
    //when hit, trigger enemy explosion!

        setTimeout(() => {
          const invaderFound = grid.invaders.find(invader2 =>invader2 === invader)
          const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
          // removes projectile & the corresponding enemy that it hits
          if (invaderFound && projectileFound) {
            score.textContent++
            createParticles({
              object: invader
            })
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
  if (frames % randomInterval === 0 ) {
    grids.push(new Grid())
    //will generate a group of enemies at random time intervals
    //re-assigning randomInterval will make sure every group is generated at a random time
    randomInterval = ~~(Math.random() * 500) + 500
    frames = 0
  }
  frames++

}
animate()
