import Particle from './particle.js';
function loadImages(paths, whenLoaded) {
    const imgs = [];
    const imgO = []
    paths.forEach(function (path) {
        const img = new Image();
        img.onload = function () {
            imgs.push(img);
            imgO.push({path,img});
            if (imgs.length === paths.length) whenLoaded(imgO);
        };
        img.src = path;
    });
}

class Sketch{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.width =  document.documentElement.clientWidth 
        this.height =  document.documentElement.clientHeight

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.time = 0;
        this.particles = [];
        
        this.x = 0;
        this.y = 0;
        this.wand = document.querySelector('.wand');


        this.colors = [
            "#e154ed",
            "#63d62b",
            "#23b1b6",
            "#ebbd3e",
            "#000000",
        ]

        loadImages(["1_.png","2_.png","3_.png"],(images)=>{
            console.log(images);
            this.images = images;
            this.img = images[0].img;
            this.raf();
            this.mousemove();
            this.mouseover();
        })
        
    }

    randomColor(){
        return this.colors[Math.floor(Math.random()*this.colors.length)]
    }

    mouseover(){
        let els = [...document.querySelectorAll('.list a')]
        els.forEach(el=>{
            el.addEventListener('mouseenter',(e)=>{
                console.log('in')
                this.fontain = true;
                this.type = e.target.getAttribute('data-type');
                this.img = this.images[this.type].img
            })
            el.addEventListener('mouseleave',()=>{
                console.log('out')
                this.fontain = false;
            })
        })
    }

    mousemove(){
        document.body.addEventListener('mousemove',(e)=>{

            let x = e.clientX;
            let y = e.clientY;

            this.wand.style.transform = `translate(${x}px,${y}px)`;

            let dx = x - this.x;
            let dy = y - this.y;

            // console.log(dx,dy)
            // let distCenter = Math.sqrt( (x-this.width/2)**2  +(y-this.height/2)**2)
            // distCenter /= Math.sqrt( (this.width/2)**2  +(this.height/2)**2);
            // console.log(distCenter)
            // distCenter= 1-distCenter;
            if(this.fontain){

            } else{
                for (let i = 0; i < 6; i++) {
                    let velX = Math.floor(dx/5 + 3*(Math.random() - 0.5));
                    let velY = Math.floor(dy/5 + 3*(Math.random() - 0.5));
                    if(this.particles.length<350){
                        this.particles.push(
                            new Particle(
                                this.img,x,y,this.randomColor(), velX, velY, 11
                            )
                        )
                    }
                }
            }
            
            this.x = x;
            this.y = y;
        })
    }


    raf(){
        this.time++;
        this.ctx.clearRect(0,0,this.width,this.height)
        // this.ctx.fillRect(this.x,this.y,100,100)
        // console.log(this.particles.length);
        if(this.fontain){
            let angle = -Math.PI + (Math.random() - 0.5)*Math.PI/4;
            let velX = (5 + 5*Math.random())*Math.sin(angle)
            let velY = (5 + 5*Math.random())*Math.cos(angle)
            let pp = new Particle(
                this.img,this.x,this.y,this.randomColor(), 
                velX, velY, 30
            )
            pp.grav = 2;
            pp.life = 20;
            this.particles.push(
                pp
            )
        }
        this.particles.forEach((p,i)=>{
            if(p.life>0) {
                p.draw(this.ctx);
            } else{
                this.particles.splice(i, 1);
            }

        })
        window.requestAnimationFrame(this.raf.bind(this))
    }
}
new Sketch();

