document.addEventListener('DOMContentLoaded', function() {
  var controller = new ScrollMagic.Controller();

  // Animación para la imagen principal
  const imagenPrincipal = document.querySelector('.imagen-principal');
  new ScrollMagic.Scene({
    triggerElement: imagenPrincipal,
    triggerHook: 0.4,
    reverse: false
  })
    .setClassToggle(imagenPrincipal, 'active')
    .addTo(controller);

  // Animación para las secciones
  const secciones = document.querySelectorAll('section');
  secciones.forEach((seccion) => {
    new ScrollMagic.Scene({
      triggerElement: seccion,
      triggerHook: 0.4,
      reverse: false
    })
      .setClassToggle(seccion, 'active')
      .addTo(controller);
  });

  // Animación para los elementos <mark>
  const subrayados = document.querySelectorAll('.mark');
  subrayados.forEach((subrayado) => {
    new ScrollMagic.Scene({
      triggerElement: subrayado,
      triggerHook: 0.7,
      reverse: true
    })
      .setClassToggle(subrayado, 'active')
      .addTo(controller);
  });

  // Animación para los elementos con clase amarillo
  const subrayadosamarillo = document.querySelectorAll('.amarillo');
  subrayadosamarillo.forEach((subrayadoamarillo) => {
    new ScrollMagic.Scene({
      triggerElement: subrayadoamarillo,
      triggerHook: 0.7,
      reverse: true
    })
      .setClassToggle(subrayadoamarillo, 'active')
      .addTo(controller);
  });

  // Animación para los elementos con clase lila
  const subrayadoslilas = document.querySelectorAll('.lila');
  subrayadoslilas.forEach((subrayadolila) => {
    new ScrollMagic.Scene({
      triggerElement: subrayadolila,
      triggerHook: 0.7,
      reverse: true
    })
      .setClassToggle(subrayadolila, 'active')
      .addTo(controller);
  });
}); 
