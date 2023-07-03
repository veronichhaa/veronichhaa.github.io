// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXdw2bcTvOvvyfFsTa1AlJBX9MucqoEbc",
    authDomain: "test-6acf4.firebaseapp.com",
    projectId: "test-6acf4",
    storageBucket: "test-6acf4.appspot.com",
    messagingSenderId: "461088805065",
    appId: "1:461088805065:web:e01cce84f7521747007d18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let form = document.querySelector('form');
let resultObj = {}

let tests = [
    {   name: 'УЗИ брюшной полости',
        result: 'Визуализируется гипоэхогенный узел в головке поджелудочной железы 2,6 см в диаметре. Вирсунгов проток дистальнее узла расширен до 4 мм в диаметре, на уровне узла не прослеживается. Желчный пузырь увеличен, внепеченочные желчные протоки – 12 мм в диаметре.',
        point: 2
    },
    {   name: 'Пункция пальпируемого образования в правом подреберье под контролем УЗИ',
        result: 'Пальпируемое образование является растянутым напряженным желчным пузырем, при пункции наступило истечение желчи в брюшную полость.',
        point: -1
    },
    {   name: 'Мультиспиральная компьютерная томография брюшной полости без контрастирования (МСКТ)',
        result: 'Нечетко визуализируется гиподенсивная зона около 1 см в головке поджелудочной железы. Вирсунгов проток в дистальных отделах железы расширен до 4 мм в диаметре. Желчный пузырь увеличен, внепеченочные желчные протоки – 12 мм в диаметре. Картину необходимо дифференцировать между панкреатитом и опухолью головки поджелудочной железы.',
        point: -0.5,
        note: 'Исследование без контрастирования не показано.'
    },
    {   name: 'Мультиспиральная компьютерная томография брюшной полости с трехфазным контрастированием (МСКТА)',
        result: 'Визуализируется гиподенсивный узел в головке поджелудочной железы 2,5 см в диаметре, слабо накапливающий контраст. Вирсунгов проток дистальнее узла расширен до 4 мм в диаметре, на уровне узла не прослеживается. Желчный пузырь увеличен, внепеченочные желчные протоки – 12 мм в диаметре. Картина характерна для рака головки поджелудочной железы.',
        point: 2
    },
    {   name: 'ФЭГДС',
        result: 'Картина поверхностного гастрита, фатеров сосочек б/о, желчь в 12–перстной кишке отсутствует.',
        point: 1
    },
    {   name: 'Фиброколоноскопия (ФКС)',
        result: 'Патологии не выявлено.',
        point: -0.1,
        note: 'Выполнение исследования не показано.'
    },
    {   name: 'Рентгенография органов грудной полости',
        result: 'Возрастные изменения.',
        point: 1
    },
    {   name: 'МСКТ органов грудной полости',
        result: 'Имеются отдельные участки повышенной пневматизации легких.',
        point: 0,
        note: 'Выполнение исследования в данном случае не показано.'
    },
    {   name: 'МРТ брюшной полости с контрастированием',
        result: 'В головке поджелудочной железы визуализируется плохо отграниченный узел 2,5 см в диаметре. Вирсунгов проток дистальнее узла расширен до 4 мм в диаметре, на уровне узла не прослеживается. Желчный пузырь увеличен, внепеченочные желчные протоки – 12 мм в диаметре. Картина рака головки поджелудочной железы.',
        point: -0.1,
        note:'Выполнение исследования на данном этапе не показано, применяется при сомнительных данных МСКТА.'
    },
    {   name: 'Эндоскопическая ретроградная холангиопанкреатикография',
        result: 'Имеется обструкция вирсунгова протока и общего желчного протока на уровне головки поджелудочной железы. Картина характерна для рака головки поджелудочной железы',
        point: -0.2,
        note: 'Выполнение исследования с диагностической целью не показано, применяется при проведении эндоскопического трансдуоденального стентирования.'
    }
]

let treatments = [
    {
        text: "Трепанбиопсия опухоли головки поджелудочной железы под контролем УЗИ. При верификации диагноза – выполнение панкреатодуоденальной резекции (ПДР), при отсутствии морфологической верификации – динамическое наблюдение.",
        getPoint: function () {
            if(isPunction()) return -3;
            else return -2;
        },
        note: function (){
            if(isPunction()) return "1 - необходимо экстренное вмешательство по поводу перфорации желчного пузыря;<br>2 - при визуализации подозрительного на злокачественный резектабельного очага в поджелудочной железе предоперационное морфологическое подтверждение диагноза не требуется - международный консенсус;<br>3 – наличие механической желтухи исключает возможность динамического наблюдения без ее купирования.";
            else return "1 - при визуализации подозрительного на злокачественный резектабельного очага в поджелудочной железе предоперационное морфологическое подтверждение диагноза не требуется - международный консенсус;<br>2 – наличие механической желтухи исключает возможность динамического наблюдения без ее купирования.";
        }

    },
    {
        text: "Лапаротомия, интраоперационная трепанбиопсия опухоли головки поджелудочной железы, при верификации диагноза – выполнение панкреатодуоденальной резекции (ПДР), при отсутствии морфологической верификации – наложение холецистоэнтероанастомоза с последующим динамическим наблюдением, повторной биопсией.",
        getPoint: function () {
            if(isPunction()) return -3;
            else return -1;
        },
        note: function () {
            if(isPunction()) return "1 - необходимо экстренное вмешательство по поводу перфорации желчного пузыря;<br>2 - при визуализации подозрительного на злокачественный резектабельного очага в поджелудочной железе предоперационное морфологическое подтверждение диагноза не требуется - международный консенсус.";
            else return "При визуализации подозрительного на злокачественный резектабельного очага в поджелудочной железе предоперационное морфологическое подтверждение диагноза не требуется - международный консенсус.";
        },
    },
    {
        text: "Лапароскопическая холецистостомия, при необходимости - с ушиванием дефекта желчного пузыря, санация и дренирование брюшной полости. Следующим этапом - выполнение панкреатодуоденальной резекции (ПДР).",
        getPoint: function () {
            if(isPunction()) return 1;
            else return -1;
        },
        note: function () {
            if(isPunction()) return "";
            else return "При неосложненной механической желтухе с уровнем общего билирубина до 250 мкмоль/л предоперационное билиарное дренирование не показано.";
        },
    },
    {
        text: "Выполнение панкреатодуоденальной резекции (ПДР).",
        getPoint: function () {
            if(isPunction()) return -3;
            else return 3;
        },
        note: function () {
            if(isPunction()) return "Необходимо экстренное вмешательство по поводу перфорации желчного пузыря;<br>";
            else return "Ок. Показано проведение послеоперационной полихимиотерапии";
        }
    },
    {
        text: "Проведение 4–6 курсов неоадъювантной (предоперационной) полихимиотерапии с последующим выполнением панкреатодуоденальной резекции (ПДР).",
        getPoint: function () {
            if(isPunction()) return -3;
            else return -1;
        },
        note: function () {
            if(isPunction()) return "1 - необходимо экстренное вмешательство по поводу перфорации желчного пузыря;<br>2 - неоадъювантная химиотерапия в данном случае не показана; проводится при погранично-резектабельном раке, после морфологической верификации.";
            else return "Неоадъювантная химиотерапия в данном случае не показана; проводится при погранично-резектабельном раке, после морфологической верификации.";
        }
    },
    {
        text: "Лапаротомия, наложение холецистоэнтероанастомоза, при необходимости - ушивание дефекта желчного пузыря, санация и дренирование брюшной полости. После ликвидации желтухи, через 3–4 недели, выполнение панкреатодуоденальной резекции (ПДР).",
        getPoint: function () {
            if(isPunction()) return 0;
            else return -1;
        },
        note: function () {
            if(isPunction()) return "1 - предпочтительно экстренное малоинвазивное вмешательство по поводу перфорации желчного пузыря; 2 - при неосложненной механической желтухе с уровнем общего билирубина до 250 мкмоль/л предоперационное билиарное дренирование не показано.<br>";
            else return "При неосложненной механической желтухе с уровнем общего билирубина до 250 мкмоль/л предоперационное билиарное дренирование не показано.";
        }

    },
    {
        text: "Трансдуоденальная папиллосфинктеротомия, стентирование общего желчного протока, трепанбиопсия опухоли головки поджелудочной железы под контролем УЗИ, при верификации диагноза – выполнение панкреатодуоденальной резекции (ПДР), при отсутствии морфологической верификации – динамическое наблюдение.",
        getPoint: function () {
            if(isPunction()) return -3;
            else return -1;
        },
        note: function () {
            if(isPunction()) return "1 - необходимо экстренное вмешательство по поводу перфорации желчного пузыря;<br>2 - при неосложненной механической желтухе с уровнем общего билирубина до 250 мкмоль/л предоперационное билиарное дренирование не показано";
            else return "При визуализации подозрительного на злокачественный резектабельного очага в поджелудочной железе предоперационное морфологическое подтверждение диагноза не требуется - международный консенсус.";
        }
    },
    {
        text: "Трансдуоденальная папиллосфинктеротомия, стентирование общего желчного протока, после снижения уровня билирубина – выполнение панкреатодуоденальной резекции (ПДР).",
        getPoint: function () {
            return -1;
        },
        note: function () {
            if(isPunction()) return "При неосложненной механической желтухе с уровнем общего билирубина до 250 мкмоль/л предоперационное билиарное дренирование не показано.";
            else return "При неосложненной механической желтухе с уровнем общего билирубина до 250 мкмоль/л предоперационное билиарное дренирование не показано.";
        }
    },
    {
        text: "Выполнение панкреатодуоденальной резекции (ПДР), затем, через 4 недели после операции, проведение 6 курсов адъювантной полихимиотерапии.",
        getPoint: function () {
            if(isPunction()) return -3;
            else return 4;
        },
        note: function () {
            if(isPunction()) return "Необходимо экстренное вмешательство по поводу перфорации желчного пузыря;<br>";
            else return "";
        }
    }
]

let runnedTests =[];
let selectedTreatment;

function check(){
    let isChecked = false;
    document.querySelectorAll("input[type=\"checkbox\"]").forEach(
        (item)=>{
            if(item.checked){
                item.disabled=true;
                isChecked=true;
                for (let test of tests){
                    if (item.name==test.name){
                        if(!runnedTests.includes(test)) {
                            runnedTests.push(test);
                            addRunnedTestToHTML(test);
                        }
                    }
                }
            }
        }
    )
   if(isChecked) document.querySelector('#finishResearchBtn').disabled = false;
    console.log(runnedTests);
}

function addTeststoHTML(){
   let el = document.querySelector(".researches");
   for (let test of tests){
      let div = document.createElement('div');
      div.classList.add('form-check');
      let input = document.createElement('input');
      input.classList.add('form-check-input');
      input.type='checkbox';
      input.name=test.name;
      let label = document.createElement('label');
      label.classList.add('form-check-label');
      label.innerText = test.name;
      div.appendChild(input);
      div.appendChild(label);
      el.appendChild(div);
   }
}

function addTreatmentstoHTML(){
    let el = document.querySelector(".treatments");
    for (let treat of treatments){
        let div = document.createElement('div');
        div.classList.add('form-check');
        let input = document.createElement('input');
        input.classList.add('form-check-input');
        input.type='radio';
        input.name='treatment';
        input.value = treat.text;
        let label = document.createElement('label');
        label.classList.add('form-check-label');
        label.innerText = treat.text;
        div.appendChild(input);
        div.appendChild(label);
        el.appendChild(div);
    }
   document.querySelector('input[type="radio"]').checked=true;
}

function addRunnedTestToHTML(test){
    let runnedTestsHTML = document.querySelector('#runnedTests');
    let runnedTest = document.createElement('li');
    runnedTest.classList.add('list-group-item');
    runnedTest.innerText=`${test.name}: ${test.result}`;
    runnedTest.innerHTML=`<span style="font-weight: bolder">${test.name}: </span>${test.result}`;
    runnedTestsHTML.appendChild(runnedTest);
}

function isPunction(){
     let punction = document.querySelector('input[name="Пункция пальпируемого образования в правом подреберье под контролем УЗИ"]').checked;
     return punction;
}

function treat(){
    document.querySelectorAll("input[type=\"radio\"]").forEach(
        (item)=>{
            if(item.checked){
                item.disabled=true;
                for (let treat of treatments){
                    if (item.value==treat.text){
                        selectedTreatment = treat;

                    }
                }
            }
        }
    )
    document.querySelector('.container').hidden=true;
    document.querySelector('.result').hidden=false;
    document.querySelector('.ball').innerHTML = `Ваш балл: <span style="font-weight: bolder">${countPoints(selectedTreatment)}</span>`;
    addResultsToHTML();
   sendToTelegram(resultObj);
}


function sendToTelegram(resultObject){
    let resultText =`   Группа: ${resultObject.group},
${resultObject.name} ${resultObject.surname},
Набранный балл: <b>${resultObject.point}</b>`;
    const TOKEN = '5681291247:AAHWUbCwPGNhh5ylkL_OsNaZP8qigGl2n3w';
    const CHAT_ID = '-1001890792495';
    const URI = `https://api.telegram.org/bot${TOKEN}/sendMessage`
    axios.post(URI, {
                chat_id: CHAT_ID,
                parse_mode: 'html',
                text: resultText
    }).then((res)=>{
        console.log(res.status);
    }).catch((err)=>{
        if(err.message) console.log('Message error: '+err.message);
        if(err.request) console.log('Request error: '+err.request);
        if(err.response) console.log('Response error: '+err.response);
    })



        // console.log(resultText)
}

function countPoints(selectedTreatment){
    let point=0;
    for(let test of runnedTests){
        point+=test.point;
    }
    console.log(point);
    point+=selectedTreatment.getPoint();
    console.log(point);
    resultObj.point = point;

    return point.toFixed(2);
}

function disableInputs(){
    document.querySelectorAll("input[type=\"checkbox\"]").forEach(
        (item)=>{
            item.disabled=true;
        }
    );
    document.querySelectorAll("input[type=\"radio\"]").forEach(
        (item)=>{
            item.disabled=true;
        }
    );
}

function start(){
    if(form.group.value && form.name.value && form.surname.value){
        document.querySelector(".sign-in").hidden=true;
        document.querySelector(".container").hidden=false;
        resultObj.group = form.group.value;
        resultObj.name = form.name.value;
        resultObj.surname = form.surname.value;
    }
}

function finishResearch(){
    document.querySelector('.treatment').hidden=false;
    document.querySelector('.runnedResearches').hidden = true;
    document.querySelector('.research').hidden=true;
}

function addResultsToHTML(){
    let runnedTestsHTML = document.querySelector('#runnedTestsResults');
    if(!runnedTests) {
        return 0
    };
    for (let test of runnedTests){
        let runnedTest = document.createElement('li');
        runnedTest.classList.add('list-group-item');
        let note;
        if(test.note){
            note = `<span style='color: red'>${test.note}</span>`;
        }
        else{
            note = `<span style='color: limegreen'>OK</span>`;
        }
        runnedTest.innerHTML=`<span>${test.name}: </span>${note}`;
        runnedTestsHTML.appendChild(runnedTest);
    }
    let treatmentResults = document.querySelector('#treatmentResults');
    let treatment = document.createElement('li');
    treatment.classList.add('list-group-item');
    let note;
    if(selectedTreatment.note()){
        note = `<p style='color: red'>${selectedTreatment.note()}</p>`;
    }
    else{
        note = `<p style='color: limegreen'>OK</p>`;
    }
    treatment.innerHTML=`<span>${selectedTreatment.text} </span>${note}`;
    treatmentResults.appendChild(treatment);
}


addTeststoHTML();

addTreatmentstoHTML();