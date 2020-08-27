let XX = []; //This will hold the X positions for each city
let YY = []; //This will hold the Y positions for each city
let startx = [];
let starty = [];
let endx = [];
let endy = [];

let pathorder = [null];

let mouseisdown = false;

let beginning = document.getElementById("beginning");
beginning.style.top = '240px';
beginning.style.left = '250px';
beginning.addEventListener('mousedown', activate);
beginning.addEventListener('mouseup', deActivate);

let ending = document.getElementById("ending");
ending.style.top = '240px';
ending.style.left = '750px';
ending.addEventListener('mousedown', activate);
ending.addEventListener('mouseup', deActivate);

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = 500;
canvas.width = 1000;
let ctx = canvas.getContext("2d");
canvas.addEventListener('mousemove', moveMe)
canvas.addEventListener('click', createCity)

document.getElementById("iterations").addEventListener('change',updateCanvas); //updating the canvas when the iterations are changed

updateCanvas();


function moveMe(e){
    if (mouseisdown) {
        let movable = document.getElementsByClassName("active")[0];
        movable.style.top = (e.clientY-9).toString()+'px';
        movable.style.left = (e.clientX-9).toString()+'px';
    }
}


function activate(e){
    e.currentTarget.className = "active";
    mouseisdown = true;
}


function deActivate(e){
    e.currentTarget.className = "inactive";
    mouseisdown = false;
    updateCanvas();
}


function updateCanvas(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let cities = document.querySelectorAll('[id=city]');

    let x = [];
    let y = [];

    for (let i=0;i<cities.length;i++){
        x.push(parseInt((cities[i].style.left).slice(0,-2)));
        y.push(parseInt((cities[i].style.top).slice(0,-2)));
    }

    XX=x;
    YY=y;

    startx=parseInt((document.getElementById("beginning").style.left).slice(0,-2));
    endx=parseInt((document.getElementById("ending").style.left).slice(0,-2));
    starty=parseInt((document.getElementById("beginning").style.top).slice(0,-2));
    endy=parseInt((document.getElementById("ending").style.top).slice(0,-2));

    TSPalgorithm();

    ctx.beginPath();
    ctx.moveTo(startx,starty);
    for (let i=0;i<XX.length;i++){
        ctx.lineTo(XX[pathorder[i]],YY[pathorder[i]]);
    }
    ctx.lineTo(endx,endy);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
}


function createCity(e){

    let obj = document.createElement("div");

    obj.style.position = "absolute";
    obj.style.width = "17px";
    obj.style.height = "17px";
    obj.style.backgroundColor = "white";
    obj.style.borderRadius = "50%";
    obj.style.zIndex = "1";
    obj.style.left = (e.clientX-9).toString()+'px';
    obj.style.top = (e.clientY-9).toString()+'px';

    obj.id = "city";
    obj.className = "inactive";
    obj.addEventListener("mousedown", activate);
    obj.addEventListener("mouseup", deActivate);
    obj.addEventListener("dblclick", deleteMe)

    document.body.appendChild(obj);

    updateCanvas();

}

function deleteMe(e){
    let element = e.currentTarget;
    element.parentNode.removeChild(element);

    updateCanvas();
}


function distance(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}


function getPathDistance(path){
    totDist = 0;
    if (XX.length>0){
        totDist+=distance(startx,starty,XX[path[0]],YY[path[0]])
        for (let i=0;i<(XX.length-1);i++){
            totDist+=distance(XX[path[i]],YY[path[i]],XX[path[i+1]],YY[path[i+1]]);
        }
        totDist+=distance(XX[(path.length-1)],YY[(path.length-1)],endx,endy)
    } else{
        totDist+=distance(startx,starty,endx,endy)
    }
    return totDist;
}


function TSPalgorithm(){

    let order = [...Array(XX.length).keys()];

    let index1 = 0;
    let index2 = 0;
    let validIndex = false;

    let totalDistance = getPathDistance(order);
    let newDist = 0;

    let iters = document.getElementById("iterations").value;

    if (XX.length > 1){
        for (let i=0;i<iters;i++){
            validIndex = false;
            while (validIndex == false){
                index1 = Math.floor(Math.random()*XX.length);
                index2 = Math.floor(Math.random()*XX.length);
                validIndex = (index2 > index1);
            }
            newDist = getPathDistance(twoOptSwap(order,index1,index2));
            if (newDist<totalDistance){
                order = twoOptSwap(order,index1,index2);
                totalDistance = getPathDistance(order);
            }
        }
    }
    pathorder = order;
}


function twoOptSwap(route,i,j){
    newRoute=[];
    newRoute.push(route.slice(0,i));
    newRoute.push(route.slice(i,j+1).reverse());
    newRoute.push(route.slice(j+1,route.length));
    newRoute = newRoute.flat();
    return newRoute;
}