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
  const subrayados = document.querySelectorAll('mark');
  subrayados.forEach((subrayado) => {
    new ScrollMagic.Scene({
      triggerElement: subrayado,
      triggerHook: 0.7,
      reverse: true
    
    })
      .setClassToggle(subrayado, 'active')
      .addTo(controller);
  });
  // Animación para los elementos <mark amarillos>
  const subrayadosamarillo = document.querySelectorAll('amarillo');
  subrayadosamarillo.forEach((subrayadoamarillo) => {
    new ScrollMagic.Scene({
      triggerElement: subrayadoamarillo,
      triggerHook: 0.7,
      reverse: true
    
    })
      .setClassToggle(subrayadoamarillo, 'active')
      .addTo(controller);
  });
  // Animación para los elementos <mark amarillos>
  const subrayadoslilas = document.querySelectorAll('lila');
  subrayadoslilas.forEach((subrayadolila) => {
    new ScrollMagic.Scene({
      triggerElement: subrayadolila,
      triggerHook: 0.7,
      reverse: true
    
    })
      .setClassToggle(subrayadoamarillo, 'active')
      .addTo(controller);
  });
  /*// Cambiar el desplazamiento a horizontal cuando el SVG entre en la vista
  const svgElement = document.querySelector('.chart-calendar');
  new ScrollMagic.Scene({
    triggerElement: svgElement,
    triggerHook: 0.7, // Ajusta según sea necesario
    duration: svgElement.scrollWidth // Duración basada en el ancho del contenido scrollable
  })
    .on('enter', function () {
      document.body.style.overflowX = 'scroll';
      document.body.style.overflowY = 'hidden';
    })
    .on('leave', function () {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'scroll';
    })
    .addTo(controller);*/
});
