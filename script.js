// Sketch p5.js – Partikel gelembung transparan yang mengikuti kursor / sentuhan
let bubbles = [];
const BUBBLE_COUNT = 70;

function setup() {
  // cari container hero canvas
  let canvasContainer = document.getElementById('hero-canvas');
  let canvasWidth = canvasContainer.offsetWidth;
  let canvasHeight = canvasContainer.offsetHeight;
  
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('hero-canvas');
  canvas.style('position', 'absolute');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '0');
  canvas.style('pointer-events', 'none'); // biar tidak mengganggu klik tombol
  
  // buat gelembung awal
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    bubbles.push(new Bubble());
  }
  
  // atur frame rate halus
  frameRate(60);
}

function draw() {
  // background navy gelap dengan transparansi efek kedalaman
  background(10, 25, 47, 235); // #0a192f dengan sedikit transparan biar lebih modern
  
  // update & tampilkan semua gelembung
  for (let bubble of bubbles) {
    bubble.update();
    bubble.show();
  }
}

function windowResized() {
  // ketika ukuran jendela berubah, sesuaikan canvas
  let container = document.getElementById('hero-canvas');
  let newW = container.offsetWidth;
  let newH = container.offsetHeight;
  resizeCanvas(newW, newH);
}

// CLASS BUBBLE – partikel transparan dengan gerakan lembut dan pengaruh kursor
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.radius = random(8, 28);
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(-0.3, 0.3);
    this.alpha = random(40, 120); // transparansi
    this.strokeAlpha = random(100, 200);
  }
  
  update() {
    // 1. Gerakan acak lembut (Brownian)
    this.speedX += random(-0.15, 0.15);
    this.speedY += random(-0.15, 0.15);
    
    // 2. Pengaruh arah kursor (sentuhan HP juga bekerja karena mouseX/mouseY)
    let mouseInCanvas = (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height);
    if (mouseInCanvas) {
      let dx = mouseX - this.x;
      let dy = mouseY - this.y;
      let distance = dist(this.x, this.y, mouseX, mouseY);
      if (distance > 5) {
        // gaya tarik halus ke arah kursor (efek "mengikuti")
        let force = 0.007;
        this.speedX += dx * force;
        this.speedY += dy * force;
      }
    }
    
    // batasi kecepatan maksimal agar gerakan tetap anggun
    let maxSpeed = 1.5;
    this.speedX = constrain(this.speedX, -maxSpeed, maxSpeed);
    this.speedY = constrain(this.speedY, -maxSpeed, maxSpeed);
    
    // perbarui posisi
    this.x += this.speedX;
    this.y += this.speedY;
    
    // wrapping halus: jika keluar, muncul dari sisi lain dengan efek lembut (lebih elegan)
    if (this.x < -this.radius) this.x = width + this.radius;
    if (this.x > width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = height + this.radius;
    if (this.y > height + this.radius) this.y = -this.radius;
  }
  
  show() {
    noFill();
    strokeWeight(1.2);
    stroke(212, 175, 55, this.strokeAlpha); // emas transparan
    fill(255, 255, 255, this.alpha * 0.3);
    circle(this.x, this.y, this.radius);
    
    // tambahan efek highlight kecil (pantulan cahaya)
    push();
    noStroke();
    fill(255, 215, 0, this.alpha * 0.4);
    circle(this.x - this.radius * 0.2, this.y - this.radius * 0.2, this.radius * 0.25);
    pop();
  }
}

// pastikan canvas tetap responsif saat orientasi layar berubah
window.addEventListener('resize', () => {
  setTimeout(() => {
    let container = document.getElementById('hero-canvas');
    if (container) {
      resizeCanvas(container.offsetWidth, container.offsetHeight);
    }
  }, 100);
});
