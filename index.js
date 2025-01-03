const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDispaly=document.querySelector("[data-passwordDispaly]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
// initial variable
let symbols='!@#$%^&*()?/:,;}{[]_=|*-+`"';
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

// set strenght circle color to grey
setIndecator("#ccc");
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=(passwordLength-min)*100/(max-min)+"%100%"
}

function setIndecator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function genetarteRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generatesymbol(){
    const randomNumber=getRndInteger(0,symbols.length);
    return symbols.charAt(randomNumber);
}

function calculateStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasSymbol=false;
    let hasNum=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(symbolsCheck.checked) hasSymbol=true;
    if(numbersCheck.checked) hasNum=true;
    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>=8){
        setIndecator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength>=6){
        setIndecator("#ff0");
    }else{
        setIndecator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDispaly.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
        
    },2000)
}



copyBtn.addEventListener('click',()=>{
    if(passwordDispaly.value){
        copyContent();
    }
})

function sufflePassword(array){
    for(let i=array.length-1;i>=0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=> (str+=el));
    return str;
}

function handleChangeCheckBox(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=> {
    checkbox.addEventListener('change',handleChangeCheckBox);
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

generateBtn.addEventListener('click',()=>{
    if(checkCount==0) return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase;
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase;
    // }
    // if(symbolsCheck.checked){
    //     password+=generatesymbol;
    // }
    // if(numbersCheck.checked){
    //     password+=genetarteRandomNumber;
    // }



    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(symbolsCheck.checked){
        funcArr.push(generatesymbol);
    }
    if(numbersCheck.checked){
        funcArr.push(genetarteRandomNumber);
    }
// compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randonIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randonIndex]();
    }
    password = sufflePassword(Array.from(password));

    passwordDispaly.value=password;
    calculateStrength();
})