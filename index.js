
async function sendRequest(url){
    const res = await fetch(url);
    const data = await res.json();
    return data;
}


function getSubmissions(user){ // ONLY 10 last for debug
    return "https://codeforces.com/api/user.status?handle=" + user;// + "&from=1&count=10";
}

//https://codeforces.com/api/contest.status?contestId=566&handle=huangxiaohua

class Contest{
    constructor(id,name,data){
        this.id = id;
        this.name = name;
        this.data = data;
    }
};

function compareContest(a,b){
    if(a.data > b.data)return -1;
    if(a.data < b.data)return 1;
    return 0;
}

async function getGyms(v,gyms){
    const mapa = new Map();
    const idBom = new Map();

    for(let i=0;i<gyms.length;i++){
        idBom.set(gyms[i].id,1);
    }

    let tam=v.length;
    if(tam > 10){// max of 10 users:
        tam = 10;
    }
    for(let i=0;i<tam;i++){ 
        console.log(getSubmissions(v[i]));
        await sendRequest(getSubmissions(v[i])).then(
            data =>{
                if(data.status == 'OK'){
                    let vet = data.result;
                    
                    for(let j=0;j<data.result.length;j++){
                    
                        if(idBom.get(data.result[j].contestId)!=undefined){
                            
                            if(mapa.get(data.result[j].contestId)==undefined){
                                mapa.set(data.result[j].contestId,data.result[j].creationTimeSeconds);
                            }
                            
                            let curT = mapa.get(data.result[j].contestId);
                            let nv = vet[j].creationTimeSeconds;

                            if(curT > nv){
                                mapa.set(data.result[j].contestId,vet[j].creationTimeSeconds);
                            }
                        }
                    }
                }
            }
        );
    }
    return mapa;
}

function pegarDia(data){
    var a = new Date(data * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
}

function gymUrl(data,id,name){
    return "<p> " + data + ": " + "<a href = " + '"' + "https://codeforces.com/gym/" + id + '"' + ">"+ name +"</a><br></p>";
}



function main(gyms){

    let v1 = JSON.parse(localStorage.getItem('stalk'));
    let v2 = JSON.parse(localStorage.getItem('you'));

    console.log(v1);
    console.log(v2);

    const nomes = new Map();
    for(const obj of gyms.result){
        nomes.set(obj.id,obj.name);
    }

    let vec = [];
    let tam = 0;
    getGyms(v1,gyms.result).then(
        mapa1 =>{
            getGyms(v2,gyms.result).then(
                mapa2 =>{
                    console.log(mapa1);
                    console.log(mapa2);

                    for(const [key,value] of mapa1){

                        if(mapa2.get(key)==undefined){
                            // nice :)
                            //document.write(gymUrl(key,nomes.get(key)));
                            vec[tam] = new Contest(key,nomes.get(key),value);
                            tam++;
                        }
                    }

                    vec.sort(compareContest);
                    document.getElementById('PLZ').innerHTML = "";
                    document.write("<h1> Found " +  vec.length + " gyms </h1>");
                    for(let i=0;i<vec.length;i++){
                        document.write(gymUrl(pegarDia(vec[i].data),vec[i].id,vec[i].name));
                    }

                }
            );
        }
    );

}

async function retornaGyms(){
    return await sendRequest('https://codeforces.com/api/contest.list?gym=true');
}
function runScript(){ 
    document.write('<p id = "PLZ">Please Wait<\p>');
    
    retornaGyms().then(
        gyms =>{
            main(gyms);
        }
    );
}
