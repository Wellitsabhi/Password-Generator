//* DECLARATION 
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//* DEFAULTS
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle to gray
setIndicator("#ccc");


//* FUNCTIONS

// SET PASSWORD LENGTH
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    // aur kuch bhi krna chahiye
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Any random number between min - max, will be utilised multiple times
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Random number 0-9
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

// ASCII values a-z
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

// ASCII values A-Z
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// Generate random symbols from string 'symbols' which contains various symbols.
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

//* Conditions for strength of password
function calcStrength() {

    // Assume every condition false at first
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // Now,if respective checkbox of condition is ticked, make them true.
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    // Rules for color. Based on strength of password.
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
//* To copy to clipboard
async function copyContent() {
    try {

        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";

    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // To make 'copy' wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

//* SHUFFLE PASSWORD
function shufflePassword(array) {
    // Fisher Yates Method (Algo)
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

//* Count how many checkboxes are checked1 
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    })

    // Special case
    if (passwordLength < checkCount)
        passwordLength = checkCount;
    handleSlider();
}
//* Check for change  in Checkbox (tick,untick) 
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

//* Change password length as Slider is moved
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

//* Agar input(jaha password aayega) non-empty h , tb copy kr skte h , vrna nhi.
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

// IMPORTANT
//* Generate Password
generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // To generate new password
    console.log("Starting the Journey");
    // 1. remove old password
    password = "";

    // 2. enter the characters mentioned in checkbox

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheckcaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();

    } console.log("Compulsory addition done");

    // Remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    } console.log("Remaining addition done");

    // Shuffle password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    // Show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    // Calculate Strength
    calcStrength();

});




