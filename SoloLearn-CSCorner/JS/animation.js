var flagArr = document.getElementsByClassName('base-flag');
var flagnumber = 0;
var offset = 0;
var countries = document.getElementsByClassName('country-container');


console.log(countries);
console.log($('.country-container'));
console.log(document.getElementsByClassName('country-container'));


//window.addEventListener('wheel', (event) => {

    
//    console.log("delta: "+event.deltaY);
    
//    if (event.deltaY > 0 && flagnumber < flagArr.length - 2) {

//        flagnumber++;
//    }
//    else if (flagnumber > 0) {
//        flagnumber--;
//    }
//    console.log("flagNum: " + flagnumber);

//    flagRevolver();
//});

function flagRevolver() {

    for (let i = 0; i < flagArr.length; i++) {
        flagArr[i].style.display = "none";
    }

    if (flagnumber < flagArr.length - 3) {


        for (let i = flagnumber; i < flagnumber + 3; i++) {
            flagArr[i].style.display = "block";
            if (i === flagnumber || i > flagnumber + 1) {
                flagArr[i].style.opacity = .5;
                flagArr[i].style.filter = "saturate(10%)";
            }
            else {
                flagArr[i].style.opacity = 1;
                flagArr[i].style.filter = "saturate(100%)";
            }
        }
    }

}