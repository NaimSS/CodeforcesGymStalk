
async function sendRequest(url){
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

/*const getData = () => {
    return sendRequest('GET','https://codeforces.com/api/contest.list?gym=true');
};*/

function getSubmissions(user){ // ONLY 10 last for debug
    return "https://codeforces.com/api/user.status?handle=" + user;// + "&from=1&count=10";
}

//https://codeforces.com/api/contest.status?contestId=566&handle=huangxiaohua

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
                    for(let j=0;j<data.result.length;j++){
                        if(idBom.get(data.result[j].contestId)!=undefined){
                            mapa.set(data.result[j].contestId,1);
                        }
                    }
                }
            }
        );
    }
    return mapa;
}

function gymUrl(id){
    return "https://codeforces.com/gym/" + id+"<br>";
}

function main(gyms){

    let v1 = JSON.parse(localStorage.getItem('stalk'));
    let v2 = JSON.parse(localStorage.getItem('you'));

    console.log(v1);
    console.log(v2);

    getGyms(v1,gyms.result).then(
        mapa1 =>{
            getGyms(v2,gyms.result).then(
                mapa2 =>{
                    console.log(mapa1);
                    console.log(mapa2);

                    for(const [key,value] of mapa1){

                        if(mapa2.get(key)==undefined){
                            // nice :)
                            document.write(gymUrl(key));
                        }
                    }

                }
            );
        }
    );

}

async function retornaGyms(){
    return await sendRequest('https://codeforces.com/api/contest.list?gym=true');
}

retornaGyms().then(
      gyms =>{
        console.log("entra");
        main(gyms);
        console.log("sai");
    }
);