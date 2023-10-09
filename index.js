const canvas =
document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
  constructor() {
    this.velocity = {x: 0, y:0}

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

    c.drawImage(this.image, this.position.x,
      this.position.y,this.width, this.height)
  }
  update() {
    if(this.image) {
      this.draw()
      this.position.x+= this.velocity.x
    }
  }
}
const player = new Player()
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

  player.velocity.x =
      keys.a.pressed  && player.position.x >= 0 ? -3
                      :
      keys.d.pressed && player.position.x + player.width <= canvas.width ? 3 : 0
  // if (keys.a.pressed) {
  //   player.velocity.x = -1
  // } else player.velocity.x = 0
}

animate()

window.addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'a':
    case 'A':
      console.log('left')

      keys.a.pressed = true
      break;
    case 'd':
    case 'D':
      console.log('right')
      keys.d.pressed = true
      break;
    case ' ':
      console.log('space')
      break;
  }
})
window.addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
    case 'A':
      console.log('left')

      keys.a.pressed = false
      break;
    case 'd':
    case 'D':
      console.log('right')
      keys.d.pressed = false
      break;
    case ' ':
      console.log('space')
      break;
  }
})
// window.onresize =
// () => {
//   canvas.width = window.innerWidth
//   player.position.x = 0.5*(canvas.width - player.width)
//   player.draw()
// }
