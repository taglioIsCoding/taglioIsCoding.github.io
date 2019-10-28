console.log("Start");


const APP_ID = "935da42f9e29eb12fc7af5abb263198e"
const BASE_URI = "http://api.openweathermap.org/data/2.5/forecast"
//API=http://samples.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml&appid=b6907d289e10d714a6e88b30761fae22
//Link icone : http://openweathermap.org/img/wn/10d@2x.png

//ricava il posto dell'API e le previsioni
function getWeatherURI(city, countryCode, mode = "json") {
  return `${BASE_URI}?q=${city},${countryCode}&mode=${mode}&appid=${APP_ID}`
}


var mymap = undefined
let previsioni = [] //una lista
let suggestions = [] // un altra lista
let city = "Milano"
city = window.prompt("Where are you looking for snow?");

  fetch(getWeatherURI(city, "it"))
    .then(response => response.json())
    .then(body => { //console.log(body.city.coord)
        console.log(body)
        console.log(body.list[0].weather); //stampa la prima previsione


        body.list.splice(9, body.list.length - 9) // riduco i vslori che visualizzo sul grafico a 9

        body.list.forEach(p => {
          let previsione = {
            codice: Math.trunc(p.weather[0].id / 100), //codice che indica con una cifra che tempo farà
            data: new Date(p.dt * 1000), //converto la data dt che era fornita in unix.timestamp
            t: Math.trunc(p.main.temp - 273.15) //ricavo la temperatura e da kelvin la converto in celsious
          }
          previsioni.push(previsione) //per ogni previsione viene aggiunta alla lista previsioni
        })

        console.log(previsioni)

        const {
          lat,
          lon
        } = body.city.coord //assegno il valore di lat e lon a due variabili con lo stesso nome

        mymap = L.map('mapid').setView([lat, lon], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoidGFnbGlvaXNjb2RpbmciLCJhIjoiY2p6anUzZHoxMGR0cTNscWE2ZHFwN3EzbyJ9._JJVq3peR2ykjC9RvV0yNw'
        }).addTo(mymap);
        var marker = L.marker([lat, lon]).addTo(mymap);


        var ctx = document.getElementById('myChart'); // è il canvas e lo recupera tramite il suo id
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
              label: 'Temperatures',
              borderColor: 'rgba(255, 0, 0, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              data: previsioni.map(previsione => { //il metodo .map() chiama una funzione per ogni elemnto dell'array
                return {
                  t: previsione.data,
                  y: previsione.t
                }
              }),
              datalabels: { //ombrellini più in alto
                align: 'end',
                anchor: 'end'
              }
            }]
          },
          options: {
            plugins: {
              datalabels: {
                formatter: function(value, context) {
                  let label = ""
                  const UMBRELLA = "\u2602"
                  const SUN = "\u2600"
                  const SNOW = "\u2744"
                  if (previsioni[context.dataIndex].codice < 6) {
                    label += "Take the: "+ UMBRELLA
                  } else if (previsioni[context.dataIndex].codice = 8) {
                    label += SUN
                  } else if (previsioni[context.dataIndex].codice = 6) {
                    label += "Yeeee" + SNOW
                  }
                  return label;
                }
              }
            },
            scales: {
              xAxes: [{
                type: 'time',

              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }],

            }
          }
        });
      } //body
    ) //then
