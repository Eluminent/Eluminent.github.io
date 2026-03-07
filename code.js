const rates = [
[0.95,0.05],[0.9,0.1],[0.85,0.15],[0.85,0.15],[0.8,0.2],
[0.75,0.25],[0.7,0.3],[0.65,0.35],[0.6,0.4],[0.55,0.45],
[0.5,0.5],[0.45,0.55],[0.4,0.6],[0.35,0.65],[0.3,0.7],
[0.3,0.679],[0.3,0.679],[0.15,0.782],[0.15,0.782],[0.15,0.765],
[0.3,0.595],[0.15,0.7225],[0.15,0.68],[0.1,0.72],[0.1,0.72],
[0.1,0.72],[0.07,0.744],[0.05,0.76],[0.03,0.776],[0.01,0.792]
]

class Attempt{
constructor(start){
this.curr_stars=start
this.booms=0
this.meso_spent=0
}
}

function calculate_cost(level,star){

let eq=level**3
let cs=(star+1)/2500
let cost=100*(Math.round(eq*cs)+10)

return cost
}

function median(arr){
arr=[...arr].sort((a,b)=>a-b)
let mid=Math.floor(arr.length/2)
return arr.length%2?arr[mid]:(arr[mid-1]+arr[mid])/2
}

function simulate(level,start,target,tries){

let meso=[]
let booms=[]

for(let i=0;i<tries;i++){

let a=new Attempt(start)

while(a.curr_stars<target){

let success=rates[a.curr_stars][0]
let fail=rates[a.curr_stars][1]
let boom=1-(success+fail)

a.meso_spent+=calculate_cost(level,a.curr_stars)

let r=Math.random()

if(r<success){
a.curr_stars++
}
else if(r<success+fail){
}
else{

a.booms++

if(a.curr_stars<=19) a.curr_stars=12
else if(a.curr_stars==20) a.curr_stars=15
else if(a.curr_stars<=22) a.curr_stars=17
else if(a.curr_stars<=25) a.curr_stars=19
else a.curr_stars=20
}
}

meso.push(a.meso_spent)
booms.push(a.booms)
}

return {meso,booms}
}

let mesoChart
let boomChart

document.querySelector(".sf-form").addEventListener("submit",function(e){

e.preventDefault()

let level=parseInt(document.querySelector("#level").value)
let start=parseInt(document.querySelector("#startStar").value)
let target=parseInt(document.querySelector("#targetStar").value)
let tries=parseInt(document.querySelector("#tries").value)

let result=simulate(level,start,target,tries)

let meanMeso=result.meso.reduce((a,b)=>a+b,0)/result.meso.length
let meanBoom=result.booms.reduce((a,b)=>a+b,0)/result.booms.length

document.querySelector("#results").innerHTML=`
<p><b>Mean Meso:</b> ${meanMeso.toLocaleString()}</p>
<p><b>Median Meso:</b> ${median(result.meso).toLocaleString()}</p>
<p><b>Mean Booms:</b> ${meanBoom}</p>
<p><b>Median Booms:</b> ${median(result.booms)}</p>
`

drawMesoChart(result.meso)
drawBoomChart(result.booms)

})

function drawMesoChart(data){

let bins={}
data.forEach(v=>{
let key=Math.floor(v/100000000)*100
bins[key]=(bins[key]||0)+1
})

let labels=Object.keys(bins)
let values=Object.values(bins)

if(mesoChart) mesoChart.destroy()

mesoChart=new Chart(
document.getElementById("mesoChart"),
{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Meso Cost Distribution",
data:values
}]
}
})
}

function drawBoomChart(data){

let bins={}
data.forEach(v=>{
bins[v]=(bins[v]||0)+1
})

let labels=Object.keys(bins)
let values=Object.values(bins)

if(boomChart) boomChart.destroy()

boomChart=new Chart(
document.getElementById("boomChart"),
{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Boom Distribution",
data:values
}]
}
})
}