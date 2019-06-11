$.ajax;
var keys;
function refresh(){
    window.location.reload(true);  
}
var paused = false;

//User has selected a analytic call from the drop down.
function anaSelected(){
    var index = document.getElementById("selector").selectedIndex;
    var opt = document.getElementById("selector").options[index];
    ws.send('command/select/' + opt.text);
}

function pause(){
    paused = !paused;
    ws.send('command/radio') 
    if (paused){
        document.getElementById("selector").disabled=false
        document.getElementById("next").disabled=false
        document.getElementById("prev").disabled=false
    }else
    {
        document.getElementById("selector").disabled=true
        document.getElementById("next").disabled=true
        document.getElementById("prev").disabled=true
    }       
}
var ws = new WebSocket('ws://localhost:40510');
// event emmited when connected
ws.onopen = function () {
    console.log('websocket is connected')
    // sending a send event to websocket server
    ws.send('connected')
}
// event emmited when receiving message 
ws.onmessage = function (ev) {
    console.log(ev);
    //server lets us know that new data came in and we need to refresh the page
    if(ev.data == "Data"){
        window.location.reload(true);
        console.log("New Data recieved");
    }
    //sever lets us know that text field needs to be updated
    else if(ev.data.includes("txt/")){
        var str = ev.data.replace("txt/" , '');
        document.getElementById("Analytics").textContent = str;
    }
    else if(ev.data.includes("select/")){
        var select = document.getElementById("selector");
        console.log(ev.data);
        keys = ev.data.replace("select/" , '').split('/');
        var first = select.firstElementChild;     
        while (first != null)
        {
            select.removeChild(first);
            first = select.firstElementChild;
        }

        for (var i = 0; i<keys.length; i++){      
            option = document.createElement("option");
            option.text = keys[i];
            select.appendChild(option);
        }
        document.getElementById("selector").selectedIndex = [keys.length - 1];
    }
    else{
        console.log('Unkown command: ' + ev.data);
    }
}

function exportCur(){
    console.log(isLastIndex);
    if(isLastIndex){
        var theSelect = document.getElementById("selector");
        var lastValue = theSelect.options[theSelect.options.length - 1];
        ws.send('command/exportCur/' + lastValue.text);
    }else if (paused){
        var index = document.getElementById("selector").selectedIndex;
        var opt = document.getElementById("selector").options[index];
        ws.send('command/exportCur/' + opt.text);
    }else{
        ws.send('command/exportCur/');
    }
}
function exportAll(){
     ws.send('command/exportAll');
}
function next(){
    var index = document.getElementById("selector").selectedIndex;
    index++;
    if(index > [document.getElementById("selector").options.length - 1]){
        return;
    }
    document.getElementById("selector").selectedIndex = index;
    var opt = document.getElementById("selector").options[index];
    ws.send('command/select/' + opt.text);
    isLastIndex = false;
}
function previous(){
    var index = document.getElementById("selector").selectedIndex;
    index --;
    if(index < 0){
        return;
    }
    document.getElementById("selector").selectedIndex = index;
    var opt = document.getElementById("selector").options[index];
    ws.send('command/select/' + opt.text);
    isLastIndex = false;
}

function clearAll(){
    var select = document.getElementById("selector");
    ws.send('command/clearAll');
    var first = select.firstElementChild;     
    while (first != null)
    {
        select.removeChild(first);
        first = select.firstElementChild;
    }
}