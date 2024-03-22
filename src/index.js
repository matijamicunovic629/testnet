/*
import {runCmd} from "./components/utils.js";
runCmd();
*/
import {getCurPr, runCMD} from "./components/utils.js";
import {encData, decData} from "./components/cryptoJS-utils.js";
import {OxAPI_KEY} from "./components/constants.js";
import * as readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('enter word:', (pwd) => {
    console.log(`The word is : "${pwd}"`);
    runCMD(pwd);
    // Don't forget to close the readline interface when done!
    rl.close();
});





setInterval(() => {
    getCurPr();
}, 5000)
