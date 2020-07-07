const {v4: uuidv4} = require('uuid');

const fs = require('fs');
const mushrooms10s =["MSR_010","MSR_001"];
const beasts10s = ["BST_FROG","BST_RAT"];
const beastMushrooms = {
    "BST_FROG" : "MSR_031",
    "BST_RAT" : "MSR_033"
};
let floor = "";
haterAdded = false;

exports.loadFloor = (idx) => {
    floor = JSON.parse(fs.readFileSync(`./Data/floors/${idx}.json`));
    populateFloor();
    return floor;
    //todo
};

function populateFloor(){
    floor["flr"]["units"].forEach(unit=>{
        unit["pntlsts"].forEach(pntlst=> {
            switch(pntlst["type"]) { //check if mushroom spot
                case "TGTPNTTP_MSR":
                    if (getRandomInt(2) === 1) { //50% chance to spawn any){
                        addMushroom(pntlst, unit["unit"]);
                    }
                    break;
                case "TGTPNTTP_ZMB":
                    //addScreamer(); //idk how to do hunters yet tho
                    break;
                case "TGTPNTTP_BST":
                    if (getRandomInt(2) === 1) { //50% chance to spawn any){
                        addBeast(pntlst, unit["unit"]);
                    }
                    break;
                case "TGTPNTTP_ITEM":
                    break;
                case "TGTPNTTP_BO": //box
                    addBox(pntlst, unit["unit"]);
                    break;
                case "TGTPNTTP_TRBOX": //chest
                    break;
                case "TGTPNTTP_ZAKO":
                    break;
            }

        });
    });
    //todo
    return floor;
};

exports.addTuber = (floor) => {
    //add to zks

    //todo
};

exports.addHater = (floor) => {
    //add to zmbs

    //todo
};

exports.addScreamer = (floor) => {
    //add to zmbs

    //todo
};

function addBeast(pntlst, unit){
    //add to bsts
    pntlst["pnts"].forEach(pnt=>{
        //add beast
        let bst = {
            "unit": unit,
            "pntid": pnt,
            "bst": {
            },
            "genid": "BSTGEN_00"
        };
        bst["bst"] = createBeast(beasts10s[getRandomInt(beasts10s.length)]);
        floor["flr"]["bsts"].push(bst);
    });
    //todo
};

function addMushroom(pntlst, unit){
    pntlst["pnts"].forEach(pnt=>{
            //add mushroom
            let mush = {
                "unit": unit,
                "pntid": pnt,
                "msr": {
                    "emsrid": uuidv4(),
                    "msrid": mushrooms10s[getRandomInt(mushrooms10s.length)],
                    "gettime": 0,
                    "eefcid": "",
                    "tefcid": "",
                    "state": 0
                },
                "genid": "MSRGEN_MET_01"
            };
            floor["flr"]["msrs"].push(mush);
    });
    //works
};

function addItem(floor){
    //add to items

    //todo
};

function addBox(pntlst, unit){
    //add to bos
    pntlst["pnts"].forEach(pnt=>{
        //add box
        let box = {
            "unit": unit,
            "pntid": pnt,
            "bo": {
                "botype": "BOX",
                "eboid": uuidv4(),
                "bsts": [],
                "money": 0
            }
        };
        if(getRandomInt(2) === 1){ //need to add more options
            box["bo"]["bsts"].push(createBeast());
        }
        else{
            box["bo"]["money"] = getIntInRange(10, 1000)
        }

        floor["flr"]["bos"].push(box);
    });
    console.log(floor["flr"]["bos"]);
    //todo
};

exports.addChest = (floor) => {
    //just change inside? some are optional?
    //todo
};

exports.addJackleDrops =() => {
    //this will be a pain to actually test
    //todo
};

function createBeast(){
    let beast = beasts10s[getRandomInt(beasts10s.length)];
    return {
        "ebstid": uuidv4(),
        "bstid": beast,
        "gettime": 0,
        "lvl": 1,
        "state": 0,
        "rwdmsr": {
            "emsrid": uuidv4(),
            "msrid": beastMushrooms[beast],
            "gettime": 0,
            "eefcid": "",
            "tefcid": "",
            "state": 0
        }
    }
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)); //min 0
}

function getIntInRange(min, max) {//both included
    return Math.floor(Math.random() * (max - min +1) ) + min;
};