window.addEventListener('keydown', ({key}) => {
  if (game.over) {
    return
  } //once player is hit, do not allow player to shoot

  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      spamCount+= 0.25
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
      if (!bulletCount) return
      const generatedBullet = new Projectile({
        position: { //where each particle spawning x,y coords are
          x:player.position.x + (player.width * .5),
          y:player.position.y
        },
        velocity: {//speed & direction of bullets
          x:0,
          y:-2
        }
      })
      projectiles.push(generatedBullet)
      keys.space.pressed = true
      bulletCount--
      //when bullet is empty, take 3 seconds to reload ammo
      !bulletCount && setTimeout(() => bulletCount = 50, 3000)
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
window.onkeypress = (e) => e.key == ' ' && e.preventDefault()

 //prevents auto scrolling behavior of spacebar key
