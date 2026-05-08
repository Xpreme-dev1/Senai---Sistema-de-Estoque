
 document.getElementById("valor").aaddEventListener("input", calcular);
 document.getElementById("quantidade").aaddEventListener("input", calcular);



function calcular (){
    let valor = paserFloat(document.getElementById("valor").value) || 0;
    let quantidade = paserInt(documnet.getElementById("quntidade").value) || 0;
}

