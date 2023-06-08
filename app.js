const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

const projection = d3.geoMercator()
        .scale(6000)
        .center([-79.2,38])
const path = d3.geoPath().projection(projection)

const colors = {
  mapStroke: "#fff",
  mapStrokeActive: "#000",
  bgFill: "#9BDBEC",
  bgMouseover: "#888"  
}

const formatToDollars = function(value) {
  const settings = Intl.NumberFormat("en-US", {
    style: "currency",
    currency:"USD",
    maximumSignificantDigits: 10
  });
  if (value == '(D)'){
    return 'not publicly available';
  }
  return settings.format(value);
}

const convertUnknownData = function(value) {
  if (value == '(D)') {return "not publicly available"};
  return value;
}

const createLegend = function(domain, range, isDollars=false) {
  for (i = 0; i < domain.length; i++) {
    d3.select('.legend').append('div').attr('class', 'legendRow')
      .html(`<span style="background-color:${range[i]}" class="legendColorBox"></span><span class="legendText">Less than: ${isDollars ? formatToDollars(domain[i]) : domain[i]}</span>`)
  }
}

const closePopup = function() {
  d3.selectAll('.popup').style('display', 'none')
}

//Colors the counties based on filter selected
function colorMap(option) {

  //First erase existing legend values
  d3.select('.legend').selectAll('.legendRow').remove();
  
  if (option == 'agSales') {
    const domain = [100000, 1000000, 10000000, 100000000, 300000000,  500000000, 1000000000];
    const range = ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"];
    const colorScale = d3.scaleThreshold().domain(domain).range(range);
    
    d3.selectAll('path').attr('fill', function(d) {
      return colorScale(d.properties.totalAgSales)
    })
    
    createLegend(domain, range, true)
  }
  
  if (option == "aquaculture") {
    const domain = [10000, 50000, 100000, 1000000, 10000000, 100000000];
    const range = ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"];
    const colorScale = d3.scaleThreshold().domain(domain).range(range);
    
     d3.selectAll('path').attr('fill', function(d) {
      if (d.properties.aquaculture == "(D)") {
        return colorScale(0)
      }
      return colorScale(d.properties.aquaculture)
    })
    
    createLegend(domain, range, true)
  }
  
  if (option == "numFarms") {
    const domain = [100, 300, 600, 1000, 2000, 3000];
    const range = ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"];
    const colorScale = d3.scaleThreshold().domain(domain).range(range)
    d3.selectAll('path').attr('fill', function(d) {
      return colorScale(d.properties.nFarms)
    })
    createLegend(domain, range)
  }
  
  if (option == "numWorkersHired") {
    const domain = [100, 200, 500, 800, 1500, 3000]
    const range = ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"]
    const colorScale = d3.scaleThreshold()
    .domain(domain).range(range);
    d3.selectAll('path').attr('fill', function(d) {
       
      if(d.properties.nWorkersHired == '(D)') {
        console.log(d.properties.atlas_name)
        return colorScale(0)
       }
      return colorScale(d.properties.nWorkersHired)
    })
    createLegend(domain, range)
  }
  
  if (option == "numMigrantsHired") {
    const domain = [20, 100, 200, 350, 500, 1000]
    const range = ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"]
    const colorScale = d3.scaleThreshold(range).domain(domain).range(range)
    
    d3.selectAll('path').attr('fill', function(d) {
      if (d.properties.nMigrantWorkersHired == '(D)') {
        return colorScale(0)
      }
      return colorScale(d.properties.nMigrantWorkersHired)
    })
    createLegend(domain, range)
  }
  
  if (option == "percFarmsHire") {
    const domain = [5, 10, 20, 30, 50, 60]
    const range = ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"]
    const colorScale = d3.scaleThreshold()
    .domain(domain).range(range)
    d3.selectAll('path').attr('fill', function(d) {
      return colorScale(d.properties.percFarmsHire)
    })
    createLegend(domain, range)
  }
  
  if (option == "percFamilyFarms") {
    const domain = [80, 85, 90, 93, 96, 100]
    const range = ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"]
    const colorScale = d3.scaleThreshold()
    .domain(domain).range(range)
    d3.selectAll('path').attr('fill', function(d) {
      return colorScale(d.properties.percFamilyFarms)
    })
    createLegend(domain, range)
  }
  
  if (option == "H2AOrders") {
    d3.selectAll('.circle')
    .attr('display', 'visible')
    
    d3.selectAll('path').attr('fill', colors.bgFill);
  }
  if (option != "H2AOrders") {
    d3.selectAll('.circle')
    .attr('display', 'none')
  }
  
  if (option == "") {
    d3.selectAll('path').attr('fill', colors.bgFill);
    
   }
}


function handleZoom(e) {
  d3.selectAll('g')
  .attr('transform', e.transform);
}

let zoom = d3.zoom().on('zoom', handleZoom);
  
        

d3.json('https://raw.githubusercontent.com/sieger1010/Virginia-GeoJson/main/VACountiesComplete.geo.json').then(function(d){
        // Draw the map
    
  svg.append("g").selectAll("path")
     .data(d.features).enter().append("path")
     .attr("id", function(data) {
         return data.properties.atlas_name
      })
      .attr("data-numberFarms", function(data) {
         return data.properties.nFarms
      })
      .attr("data-numberWorkers", function(data) {
          return data.properties.nWorkersHired
        })
      .attr("data-numMigrantWorkers", function(data) {
          return convertUnknownData(data.properties.nMigrantWorkersHired)
        })
      .attr("data-totalAgSales", function(data) {
          return data.properties.totalAgSales
        })
      .attr("data-topIndustry1", function(data) {
          return convertUnknownData(data.properties.industry1)
        })
      .attr("data-topIndustry2", function(data) {
          return convertUnknownData(data.properties.industry2)
        })
      .attr("data-topIndustry3", function(data) {
          return convertUnknownData(data.properties.industry3)
        })
      .attr("data-topCropsByAcres", function(data) {
          return data.properties.topCropsAcres
        })
      .attr("data-aquaculture", function(data) {
          return data.properties.aquaculture
        })
      .attr("fill", colors.bgFill)
      .attr("d", path)
      .style("stroke", colors.mapStroke)
      .on("mouseover", function() {
        d3.select(this).transition().duration(250)
        .attr("opacity", 0.5)            
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(250)
        .attr("opacity", 1)                  
      })
      .on("click", function() {
        d3.select('#infoBox').selectAll('.value').remove();
        d3.select('#countyName').append('span').attr('class', 'value')
          .text(this.id);
        d3.select('#numFarms').append('span').attr('class', 'value')
          .text(this.dataset.numberFarms);
        d3.select('#numWorkers').append('span').attr('class', 'value')
          .text(this.dataset.numberWorkers);
        d3.select('#numMigrantWorkers').append('span').attr('class', 'value')
          .text(this.dataset.numMigrantWorkers);
        d3.select('#totalAgSales').append('span').attr('class', 'value')
          .text(formatToDollars(this.dataset.totalAgSales));
        d3.select('#topIndustry1').append('span').attr('class', 'value')
          .text(this.dataset.topIndustry1);
        d3.select('#topIndustry2').append('span').attr('class', 'value')
          .text(this.dataset.topIndustry2);
        d3.select('#topIndustry3').append('span').attr('class', 'value')
          .text(this.dataset.topIndustry3);
        d3.select('#topCropsByAcres').append('span').attr('class', 'value')
          .text(this.dataset.topCropsByAcres);
        d3.select('#aquaculture').append('span').attr('class', 'value')
          .text(formatToDollars(this.dataset.aquaculture));
       })
  
  svg.append("g")
    .attr("class", "county-names")
    .selectAll("text")
    .data(d.features).enter()
    .append("svg:text")
    .attr("id", function(data){
      return data.properties.atlas_name
    })
    .text(function(data) {
      return data.properties.atlas_name;
    })
    .attr("x", function(data) {
       return path.centroid(data)[0];
    })
    .attr("y", function(data) {
       return path.centroid(data)[1];
    })
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
  
  //zoom
  d3.select('svg')
  .call(zoom)
  
  //Draw H2A Order Points
  d3.json('https://raw.githubusercontent.com/sieger1010/Virginia-GeoJson/main/H2AOrders.geo.json').then(function(data) {
    
    const domain = [0, 100];
    const range = [1.5, 8];    
    const radScale = d3.scaleSqrt()
    .domain(domain)
    .range(range)
    
    svg.append('g').selectAll('.circle')
    .data(data.features).enter().append('svg:circle')
    .attr('id', function(d) {
      return d.properties.id
    })
    .attr('class', 'circle')
    .attr('cx', function(d) {
      return projection(d.geometry.coordinates)[0]
    })
    .attr('cy', function(d) {
      return projection(d.geometry.coordinates)[1]
    })  
    .attr('r', function(d) {
      return radScale(d.properties.nH2AWorkers)
    })
    .attr('fill', 'black')
    .attr('display', 'none')
    .on('mouseenter', function(e) {
      
      d3.select(this).transition()
      .duration('100')
      .attr('opacity', '.65')      
    })
    .on('mouseleave', function() {
      d3.select(this).transition()
      .duration('100')
      .attr('opacity', '1')
      .attr('r', function(d) {
      return radScale(d.properties.nH2AWorkers)
      })
    })
    .on('click', function(e, d) {
      const posX = e.pageX;
      const posY = e.pageY;
      
      
      d3.select('.popup')
      .style('display', 'block')
      .style('left', posX + 15 + 'px')
      .style('top', posY - 50 + 'px')
      .html('')
      .append('p')
      .html('<div class="btnClose" onclick="closePopup()">X</div><b>'+d.properties.name+'</b><br><b>Order Number: </b>'+d.properties.orderNumber+'<br><b>Start Date: </b>'+d.properties.startDate+'<br><b>Number of H-2A Workers: </b>'+d.properties.nH2AWorkers+'<br><b>Job Title: </b>'+d.properties.jobTitle+'<br><b>City: </b>'+d.properties.city)
      
      
    })
  })
  
})

