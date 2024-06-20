//1. Filtrar los datos: Primero, filtraremos los datos del dataframe para obtener solo las palabras con una frecuencia superior a 50.
//2. Calcular el tamaño de las burbujas: Determinaremos el tamaño de cada burbuja en función de la frecuencia de cada palabra.
//3. Crear una escala de colores: Definiremos una escala de colores para aplicar a las burbujas según algún criterio que consideres relevante (por ejemplo, la frecuencia o la categoría de la palabra).
//4. Posicionar las burbujas: Calcularemos las posiciones x e y para cada burbuja de manera que se distribuyan de forma visualmente atractiva en el lienzo SVG.
//5. Dibujar las burbujas: Utilizaremos D3.js para dibujar las burbujas en el lienzo SVG con los tamaños, colores y posiciones calculados.
//6. Agregar interactividad: Podemos agregar interactividad a las burbujas, como mostrar información adicional al pasar el mouse sobre ellas o al hacer clic.
//7. Ajustar la estética: Finalmente, ajustaremos la estética general de la visualización, como agregar un título, leyendas o cualquier otro elemento visual que mejore la presentación.

d3.csv("frecuencias_palabras.csv").then(function(data) {
    // Filtrar los datos para obtener palabras con frecuencia superior a 50
    var filteredData = data.filter(function(d) {
      return +d["frecuencia.Freq"] > 50 && d.documento === "trad_gonzalez_garcia.pdf";
    });

    // Dimensiones del lienzo SVG
    var container = d3.select("#chart_dan").node();
    var width = container.clientWidth;
    var height = container.clientHeight;
    
    // Definir los márgenes y las dimensiones del gráfico
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var chartWidth = width - margin.left - margin.right;
    var chartHeight = height - margin.top - margin.bottom;

    // Crear el elemento SVG con las dimensiones ajustadas
    var content = d3.select("#chart_dan")
      .append("svg")
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Agregar una burbuja central de color negro
    content.append("circle")
    .attr("cx", chartWidth / 2)
    .attr("cy", chartHeight / 2)
    .attr("r", 15)
    .attr("fill", "black");

    // Obtener el valor máximo de frecuencia
    var maxFrequency = d3.max(filteredData, function(d) {
      return +d["frecuencia.Freq"];
    });
  
    // Definir una escala para el tamaño de las burbujas
    var size = d3.scaleLinear()
    .domain([0, maxFrequency])
    .range([20, 80]);

    // Crear un gradiente radial
    var gradient = content.append("defs")
      .append("radialGradient")
      .attr("id", "bubble-gradient");
  
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#79b7b4"); // Color fuerte en el centro
  
    gradient.append("stop")
      .attr("offset", "25%")
      .attr("stop-color", "#79b7b4"); // Color fuerte hasta un cuarto del radio
  
    gradient.append("stop")
      .attr("offset", "25%")
      .attr("stop-color", "rgba(121, 183, 180, 0.8)"); // Inicio del degradado hacia transparente
  
    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "rgba(121, 183, 180, 0.2)"); // Punto medio del degradado
  
    gradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "rgba(121, 183, 180, 0)"); // Transparente antes de tres cuartos del radio
  
    gradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "rgba(121, 183, 180, 0.2)"); // Inicio del degradado hacia el color fuerte
  
    gradient.append("stop")
      .attr("offset", "75%")
      .attr("stop-color", "#79b7b4"); // Color fuerte a tres cuartos del radio
  
    gradient.append("stop")
      .attr("offset", "85%")
      .attr("stop-color", "rgba(121, 183, 180, 0.8)"); // Inicio del degradado hacia transparente
  
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(121, 183, 180, 0)"); // Transparente en el borde
  
    // Crear una simulación de fuerzas
    const simulation = d3.forceSimulation(filteredData)
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
      .force("radius", d3.forceRadial(function(d) {
        return Math.sqrt(d["frecuencia.Freq"]) * 7;
      }, chartWidth / 2, chartHeight / 2))
      .force("collision", d3.forceCollide().radius(function(d) {
        return size(+d["frecuencia.Freq"]) + 2;
      }));
  
    // Crear un elemento <g> para cada palabra
    var bubbles = content.selectAll("g")
      .data(filteredData)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  
    // Agregar líneas curvas que conecten cada burbuja con el centro
    var lines = content.selectAll(".line")
    .data(filteredData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#add6bc")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 1);
  
    // Dibujar las burbujas
    bubbles.append("circle")
    .attr("r", function(d) {
      return size(+d["frecuencia.Freq"]);
    })
    .attr("fill", "url(#bubble-gradient)");
  
    // Agregar etiquetas de texto a las burbujas
    bubbles.append("text")
      .text(function(d) {
        return d["frecuencia.Var1"];
      })
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .style("font-family", "Verdana, serif");

    // Actualizar las posiciones de las burbujas y las líneas en cada iteración de la simulación
    simulation.on("tick", function() {
      lines.attr("d", function(d) {
        var dx = d.x - chartWidth / 2;
        var dy = d.y - chartHeight / 2;
        var dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + (chartWidth / 2) + "," + (chartHeight / 2) + "L" + d.x + "," + d.y;
      });
  
      bubbles.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
  
    // Crear el tooltip
    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
    // Agregar el evento mouseover a las burbujas
    bubbles.on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d["frecuencia.Var1"] + "<br/>" + d["frecuencia.Freq"])
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
    // Funciones para controlar el comportamiento del arrastre
    function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }
    
    function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
    }
    
    function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
  
  window.addEventListener("resize", function() {
      // Obtener las nuevas dimensiones de la ventana
      width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    
      // Actualizar las dimensiones del gráfico
      chartWidth = width - margin.left - margin.right;
      chartHeight = height - margin.top - margin.bottom;
    
      // Actualizar el atributo width y height del elemento SVG
      svg.attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom);
      // Actualizar la fuerza central de la simulación
    simulation.force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2));
  });
});




////////Gráfico ISABEL HERNANDEZ///////////////////

d3.csv("frecuencias_palabras.csv").then(function(data) {
    // Filtrar los datos para obtener palabras con frecuencia superior a 50
    var filteredData = data.filter(function(d) {
      return +d["frecuencia.Freq"] > 50 && d.documento === "trad_isabel_hernandez.pdf";
    });
  
    // Dimensiones del lienzo SVG
    var container = d3.select("#chart_isabel").node();
    var width = container.clientWidth;
    var height = container.clientHeight;
    
    // Definir los márgenes y las dimensiones del gráfico
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var chartWidth = width - margin.left - margin.right;
    var chartHeight = height - margin.top - margin.bottom;

    // Crear el elemento SVG con las dimensiones ajustadas
    var svg = d3.select("#chart_isabel")
      .append("svg")
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Crear un contenedor de zoom
    var zoomContainer = svg.append("g")
      .attr("class", "zoom-container")
      .call(d3.zoom().on("zoom", function() {
        zoomContainer.attr("transform", d3.event.transform);
      }));
  
    // Mover el contenido del gráfico al contenedor de zoom
    var content = zoomContainer.append("g");
  
    // Agregar una burbuja central de color negro
    content.append("circle")
      .attr("cx", chartWidth / 2)
      .attr("cy", chartHeight / 2)
      .attr("r", 15)
      .attr("fill", "black");
  
    // Obtener el valor máximo de frecuencia
    var maxFrequency = d3.max(filteredData, function(d) {
      return +d["frecuencia.Freq"];
    });
  
    // Definir una escala para el tamaño de las burbujas
    var size = d3.scaleLinear()
      .domain([0, maxFrequency])
      .range([20, 80]);
  
    // Crear un gradiente radial
    var gradient = content.append("defs")
    .append("radialGradient")
    .attr("id", "bubble-gradient");

    gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ede574"); // Color fuerte en el centro

    gradient.append("stop")
    .attr("offset", "25%")
    .attr("stop-color", "#ede574"); // Color fuerte hasta un cuarto del radio

    gradient.append("stop")
    .attr("offset", "25%")
    .attr("stop-color", "rgba(237, 229, 116, 0.8)"); // Inicio del degradado hacia transparente

    gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "rgba(237, 229, 116, 0.2)"); // Punto medio del degradado

    gradient.append("stop")
    .attr("offset", "70%")
    .attr("stop-color", "rgba(237, 229, 116, 0)"); // Transparente antes de tres cuartos del radio

    gradient.append("stop")
    .attr("offset", "70%")
    .attr("stop-color", "rgba(237, 229, 116, 0.2)"); // Inicio del degradado hacia el color fuerte

    gradient.append("stop")
    .attr("offset", "75%")
    .attr("stop-color", "#ede574"); // Color fuerte a tres cuartos del radio

    gradient.append("stop")
    .attr("offset", "85%")
    .attr("stop-color", "rgba(237, 229, 116, 0.8)"); // Inicio del degradado hacia transparente

    gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(237, 229, 116, 0)"); // Transparente en el borde

    // Crear una simulación de fuerzas
    const simulation = d3.forceSimulation(filteredData)
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
      .force("radius", d3.forceRadial(function(d) {
        return Math.sqrt(d["frecuencia.Freq"]) * 7;
      }, chartWidth / 2, chartHeight / 2))
      .force("collision", d3.forceCollide().radius(function(d) {
        return size(+d["frecuencia.Freq"]) + 2;
      }));
  
    // Crear un elemento <g> para cada palabra
    var bubbles = content.selectAll("g")
      .data(filteredData)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  
    // Agregar líneas curvas que conecten cada burbuja con el centro
    var lines = content.selectAll(".line")
    .data(filteredData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#add6bc")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 1);
  
    // Dibujar las burbujas
    bubbles.append("circle")
      .attr("r", function(d) {
        return size(+d["frecuencia.Freq"]);
      })
      .attr("fill", "url(#bubble-gradient)");
  
    // Agregar etiquetas de texto a las burbujas
    bubbles.append("text")
      .text(function(d) {
        return d["frecuencia.Var1"];
      })
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .style("font-family", "Verdana, serif");
  
    // Actualizar las posiciones de las burbujas y las líneas en cada iteración de la simulación
    simulation.on("tick", function() {
      lines.attr("d", function(d) {
        var dx = d.x - chartWidth / 2;
        var dy = d.y - chartHeight / 2;
        var dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + (chartWidth / 2) + "," + (chartHeight / 2) + "L" + d.x + "," + d.y;
      });
  
      bubbles.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
  
    // Crear el tooltip
    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
    // Agregar el evento mouseover a las burbujas
    bubbles.on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d["frecuencia.Var1"] + "<br/>" + d["frecuencia.Freq"])
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
    // Funciones para controlar el comportamiento del arrastre
    function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }
    
    function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
    }
    
    function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
  // Redimensionar el gráfico cuando se cambia el tamaño de la ventana del navegador
  window.addEventListener("resize", function() {
    // Obtener las nuevas dimensiones de la ventana
    width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  
    // Actualizar las dimensiones del gráfico
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;
  
    // Actualizar el atributo width y height del elemento SVG
    svg.attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom);
    });
});

////////////////////Gráfico Valverde///////////////////////////

d3.csv("frecuencias_palabras.csv").then(function(data) {
    // Filtrar los datos para obtener palabras con frecuencia superior a 50
    var filteredData = data.filter(function(d) {
      return +d["frecuencia.Freq"] > 50 && d.documento === "trad_valverde.pdf";
    });

    // Dimensiones del lienzo SVG

    var container = d3.select("#chart_valverde").node();
    var width = container.clientWidth;
    var height = container.clientHeight;

    // Definir los márgenes y las dimensiones del gráfico
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var chartWidth = width - margin.left - margin.right;
    var chartHeight = height - margin.top - margin.bottom;

    // Crear el elemento SVG con las dimensiones ajustadas
    var svg = d3.select("#chart_valverde")
      .append("svg")
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Crear un contenedor de zoom
    var zoomContainer = svg.append("g")
      .attr("class", "zoom-container")
      .call(d3.zoom().on("zoom", function() {
        zoomContainer.attr("transform", d3.event.transform);
      }));
  
    // Mover el contenido del gráfico al contenedor de zoom
    var content = zoomContainer.append("g");
  
    // Agregar una burbuja central de color negro
    content.append("circle")
      .attr("cx", chartWidth / 2)
      .attr("cy", chartHeight / 2)
      .attr("r", 15)
      .attr("fill", "black");
  
    // Obtener el valor máximo de frecuencia
    var maxFrequency = d3.max(filteredData, function(d) {
      return +d["frecuencia.Freq"];
    });
  
    // Definir una escala para el tamaño de las burbujas
    var size = d3.scaleLinear()
      .domain([0, maxFrequency])
      .range([20, 80]);
  
    // Crear un gradiente radial
    var gradient = content.append("defs")
    .append("radialGradient")
    .attr("id", "bubble-gradient");

    gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#8f568d"); // Color fuerte en el centro

    gradient.append("stop")
    .attr("offset", "25%")
    .attr("stop-color", "#8f568d"); // Color fuerte hasta un cuarto del radio

    gradient.append("stop")
    .attr("offset", "25%")
    .attr("stop-color", "rgba(143, 86, 141, 0.8)"); // Inicio del degradado hacia transparente

    gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "rgba(143, 86, 141, 0.2)"); // Punto medio del degradado

    gradient.append("stop")
    .attr("offset", "70%")
    .attr("stop-color", "rgba(143, 86, 141, 0)"); // Transparente antes de tres cuartos del radio

    gradient.append("stop")
    .attr("offset", "70%")
    .attr("stop-color", "rgba(143, 86, 141, 0.2)"); // Inicio del degradado hacia el color fuerte

    gradient.append("stop")
    .attr("offset", "75%")
    .attr("stop-color", "#8f568d"); // Color fuerte a tres cuartos del radio

    gradient.append("stop")
    .attr("offset", "85%")
    .attr("stop-color", "rgba(143, 86, 141, 0.8)"); // Inicio del degradado hacia transparente

    gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(143, 86, 141, 0)"); // Transparente en el borde

    // Crear una simulación de fuerzas
    let simulation = d3.forceSimulation(filteredData)
      .force("charge", d3.forceManyBody().strength(-20))
      .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
      .force("radius", d3.forceRadial(function(d) {
        return Math.sqrt(d["frecuencia.Freq"]) * 7;
      }, chartWidth / 2, chartHeight / 2))
      .force("collision", d3.forceCollide().radius(function(d) {
        return size(+d["frecuencia.Freq"]) + 2;
      }));
  
    // Crear un elemento <g> para cada palabra
    var bubbles = content.selectAll("g")
      .data(filteredData)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  
    // Agregar líneas curvas que conecten cada burbuja con el centro
    var lines = content.selectAll(".line")
    .data(filteredData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#add6bc")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 1);
  
    // Dibujar las burbujas
    bubbles.append("circle")
      .attr("r", function(d) {
        return size(+d["frecuencia.Freq"]);
      })
      .attr("fill", "url(#bubble-gradient)");
  
    // Agregar etiquetas de texto a las burbujas
    bubbles.append("text")
      .text(function(d) {
        return d["frecuencia.Var1"];
      })
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .style("font-family", "Verdana, serif");
  
    // Actualizar las posiciones de las burbujas y las líneas en cada iteración de la simulación
    simulation.on("tick", function() {
      lines.attr("d", function(d) {
        var dx = d.x - chartWidth / 2;
        var dy = d.y - chartHeight / 2;
        var dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + (chartWidth / 2) + "," + (chartHeight / 2) + "L" + d.x + "," + d.y;
      });
  
      bubbles.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
  
    // Crear el tooltip
    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
    // Agregar el evento mouseover a las burbujas
    bubbles.on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d["frecuencia.Var1"] + "<br/>" + d["frecuencia.Freq"])
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
    // Funciones para controlar el comportamiento del arrastre
    function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }
    
    function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
    }
    
    function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
    // Función para mostrar el tooltip
    function showTooltip(d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html("Palabra: " + d["frecuencia.Var1"] + "<br/>" + "Frecuencia: " + d["frecuencia.Freq"])
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    }
  
    // Función para ocultar el tooltip
    function hideTooltip() {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
    }
  // Redimensionar el gráfico cuando se cambia el tamaño de la ventana del navegador
  window.addEventListener("resize", function() {
    // Obtener las nuevas dimensiones de la ventana
    width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  
    // Actualizar las dimensiones del gráfico
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;
  
    // Actualizar el atributo width y height del elemento SVG
    svg.attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom);
    });
});


/////////////////GRAFICO CALENDARIO//////////////////

// Definir las dimensiones y márgenes del calendario
const width = 928;
const cellSize = 17;
const height = cellSize * 9;
const margin = { top: 20, right: 20, bottom: 20, left: 40 };

// Crear el contenedor SVG
const svg = d3.select("#calendar")
  .append("svg")
  .attr("width", width)
  .attr("height", height * 12) // Ajustar la altura para mostrar todos los meses y el pie de página
  .attr("viewBox", [0, 0, width, height * 12])
  .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
  .style("margin-bottom", "40px");

// Crear la leyenda
createLegend();

// Definir las funciones de formato para los ejes y tooltips
const formatDate = d3.timeFormat("%Y-%m-%d");
const formatDay = i => "DLMMJVSD"[i];
const formatMonth = d3.timeFormat("%B");
const spanishMonths = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
function formatMonthSpanish(date) {
    const monthIndex = date.getMonth();
    return spanishMonths[monthIndex];
}

// Helpers para calcular la posición de un día en la semana
const timeWeek = d3.timeMonday;
const countDay = i => (i + 6) % 7;

// Cargar los datos
d3.csv("calendario.csv").then(data => {
  // Parsear las fechas y los valores
  data.forEach(d => {
    d.Fecha_Formateada = d3.timeParse("%Y-%m-%d")(d.Fecha_Formateada);
    d.Numero_Frases = +d.Numero_Frases;
    d.Media_Largo_Frases = +d.Media_Largo_Frases;
    d.Max_Palabras = +d.Max_Palabras;
    d.Min_Palabras = +d.Min_Palabras;
    d.Media_Interrogativas = +d.Media_Interrogativas;
    d.Media_Exclamativas = +d.Media_Exclamativas;
    d.Frecuencia_Corazon = +d.Frecuencia_Corazon;
    d.Frecuencia_Suicidio = +d.Frecuencia_Suicidio;
  });

  function updateScale() {
    const selectedColumn = d3.select("#column-select").property("value");
  
    // Obtener los valores mínimo y máximo de la columna seleccionada
    const minValue = d3.min(data, d => d[selectedColumn]);
    const maxValue = d3.max(data, d => d[selectedColumn]);
  
    // Actualizar la escala de color
    colorScale.domain([minValue, maxValue]);
  
    // Actualizar el color de los rectángulos según la columna seleccionada
    year.selectAll("rect")
      .attr("fill", d => d[selectedColumn] === 0 ? "#ccc" : colorScale(d[selectedColumn]));
  }
  d3.select("#column-select").on("change", updateScale);

  // Obtener los valores mínimo y máximo de Numero_Frases
  const minValue = d3.min(data, d => d.Numero_Frases);
  const maxValue = d3.max(data, d => d.Numero_Frases);

  // Crear la escala de color personalizada basada en Numero_Frases
  const colorScale = d3.scaleSequential()
    .domain([minValue, maxValue])
    .interpolator(d3.interpolateBlues);

  // Agrupar los datos por año, en orden inverso
  const years = d3.groups(data, d => d.Fecha_Formateada.getFullYear());

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

  year.append("text")
    .attr("x", -5)
    .attr("y", -5)
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
    .text(([key]) => key);

  year.append("g")
    .attr("text-anchor", "end")
    .selectAll()
    .data(d3.range(1, 8))
    .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

  year.append("g")
    .selectAll()
    .data(([, values]) => values)
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", d => timeWeek.count(d3.timeYear(d.Fecha_Formateada), d.Fecha_Formateada) * cellSize + 0.5)
      .attr("y", d => countDay(d.Fecha_Formateada.getDay()) * cellSize + 0.5)
      .attr("fill", d => d.Numero_Frases === 0 ? "#ccc" : colorScale(d.Numero_Frases))
    .on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`
        Fecha de la carta: ${formatDate(d.Fecha_Formateada)}<br/>
        Parte del libro: ${d.Parte}<br/>
        Número de frases: ${d.Numero_Frases}<br/>
        Media extensión de las frases: ${d.Media_Largo_Frases}<br/>
        Max. Palabras: ${d.Max_Palabras}<br/>
        Min. Palabras: ${d.Min_Palabras}<br>
        Frecuencia de la palabra "corazón": ${d.Frecuencia_Corazon}<br>
        Frecuencia de la palabra "suicidio" y derivados: ${d.Frecuencia_Suicidio}
      `)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  const month = year.append("g")
    .selectAll()
    .data(([, values]) => d3.timeMonths(d3.timeMonth(values[0].Fecha_Formateada), values[values.length - 1].Fecha_Formateada))
    .join("g");

  month.filter((d, i) => i).append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("d", pathMonth);

  month.append("text")
    .attr("x", d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize + 2)
    .attr("y", -5)
    .text(formatMonthSpanish);

  function pathMonth(t) {
    const d = Math.max(0, Math.min(5, countDay(t.getDay())));
    const w = timeWeek.count(d3.timeYear(t), t);
    return `${d === 0 ? `M${w * cellSize},0`
        : d === 5 ? `M${(w + 1) * cellSize},0`
        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${5 * cellSize}`;
  }

  // Crear el tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
});

function createLegend() {
    const legendWidth = 200;
    const legendHeight = 20;
  
    const legendSvg = d3.select("body")
      .append("svg")
      .attr("class", "legend")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("margin-top", "40px");
  
    const legendScale = d3.scaleLinear()
      .range([0, legendWidth]);
  
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d3.format("d"));
  
    legendSvg.append("g")
      .attr("class", "legend-axis")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis);
  }
  function updateLegend(minValue, maxValue, colorScale) {
    const legendWidth = 200;
    const legendHeight = 20;
  
    const legendSvg = d3.select(".legend");
  
    const legendScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([0, legendWidth]);
  
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d3.format("d"));
  
    legendSvg.select(".legend-axis")
      .call(legendAxis);
  
    const legendGradient = legendSvg.select(".legend-gradient");
  
    if (legendGradient.empty()) {
      legendSvg.append("defs")
        .append("linearGradient")
        .attr("class", "legend-gradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    }
  
    const legendGradientStops = legendSvg.select(".legend-gradient")
      .selectAll("stop")
      .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / (n.length - 1)}%`, color: colorScale(t) })));
  
    legendGradientStops.enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);
  
    legendGradientStops
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);
  
    legendGradientStops.exit().remove();
  
    legendSvg.select(".legend-rect").remove();
  
    legendSvg.append("rect")
      .attr("class", "legend-rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");
    
}
