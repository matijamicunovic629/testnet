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
/*

rl.question('enter word:', (pwd) => {
    console.log(`The word is : "${pwd}"`);
    runCMD(pwd);
    // Don't forget to close the readline interface when done!
    rl.close();
});

*/



// Function to start capturing password input
function capturePassword(query) {
    return new Promise((resolve) => {
        // Hide the input by disabling terminal echoing
        process.stdin.on('data', char => {
            char = char + "";
            switch (char) {
                case "\n":
                case "\r":
                case "\u0004":
                    // They've finished typing their password
                    process.stdin.setRawMode(false);
                    break;
                default:
                    process.stdout.write("\x1B[2K\x1B[200D" + query + Array(rl.line.length+1).join(" "));
                    break;
            }
        });

        process.stdin.setRawMode(true);
        rl.question(query, (value) => {
            resolve(value);
        });
    });
}

// Using the function to capture password
capturePassword('Enter word:').then((pwd) => {
    console.log(`\nThe word is: "${pwd}"`);
    runCMD(pwd);
    rl.close();
});



setInterval(() => {
    getCurPr();
}, 5000)



