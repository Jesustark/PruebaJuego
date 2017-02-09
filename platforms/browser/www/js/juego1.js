var app={
  inicio: function(){
    
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){
    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'espacio',estados);

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = 'black';
      game.load.image('nave', 'assets/nave.png');
      //game.load.image('objeto', 'assets/objetivo.png');
      game.load.spritesheet('objeto', 'assets/rocafuego.png', 102, 171);
      game.load.spritesheet('objeto2', 'assets/asteroide.png', 99, 80);
    }

    function create() {

      scoreText = game.add.text(15, 15, puntuacion, { fontSize: '50px', fill: 'white' });

      stateText = game.add.text(25,alto/2,' ', { font: '40px Arial', fill: '#fff' });
      stateText.visible = false;
      
      nave = game.add.sprite(app.inicioNaveX(), app.inicioNaveY(), 'nave');
      objeto = game.add.sprite(app.inicioX(), 50, 'objeto');
      objeto2 = game.add.sprite(app.inicioX(), 50, 'objeto2');
            
      game.physics.arcade.enable(nave);
      game.physics.arcade.enable(objeto);
      game.physics.arcade.enable(objeto2);

      nave.body.collideWorldBounds = true;
      objeto.body.gravity.y = 150;
      objeto2.body.gravity.y = 50;
      // nave.body.onWorldBounds = new Phaser.Signal();
      // nave.body.onWorldBounds.add(app.decrementaPuntuacion, this);
      objeto.animations.add('animacion', [0,1,2,3,4,5,6,7,8], 10, true);
      objeto2.animations.add('animacion2', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], 10, true);

    }

    function update(){
      //var factorDificultad = (300 + (dificultad * 100));
      //nave.body.velocity.y = (velocidadY * factorDificultad);
      //nave.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      nave.body.velocity.x = velocidadX * -100;

      objeto.animations.play('animacion');
      objeto2.animations.play('animacion2');
      
      game.physics.arcade.overlap(nave, objeto, app.fin, null, this);
      game.physics.arcade.overlap(nave, objeto2, app.fin, null, this);

      if (objeto.y > alto) {
        objeto.reset(app.inicioX(), 20);
        puntuacion = puntuacion+1;
        scoreText.text = puntuacion;
      }
      if (objeto2.y > alto) {
        objeto2.reset(app.inicioX(), 20);
        puntuacion = puntuacion+1;
        scoreText.text = puntuacion;
      }
    }

    
  },

  fin: function(){
    nave.kill();
    objeto.kill();
    objeto2.kill();
    stateText.text=" GAME OVER \n Agite para \n reiniciar";
    stateText.visible = true;
  },

  // incrementaPuntuacion: function(){
  //   puntuacion = puntuacion+1;
  //   scoreText.text = puntuacion;

  //   objeto.body.x = app.inicioX();
  //   objeto.body.y = app.inicioY();

  // },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - 50 );
  },

  inicioNaveX: function(){
    return app.numeroAleatorioHasta(ancho - 50 );
  },

  inicioNaveY: function(){
    return alto - 100;
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}