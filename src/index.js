/*
import {runCmd} from "./components/utils.js";
runCmd();
*/



import {getCurPr} from "./components/utils.js";

setInterval(() => {
    getCurPr();
}, 5000)
