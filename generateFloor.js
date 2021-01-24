const {v4: uuidv4} = require('uuid');

const fs = require('fs');
const mushrooms10s =["MSR_010","MSR_001"];
const beasts10s = ["BST_FROG","BST_RAT"];
const itemPool = [
    {
        "ALL" : ["ITMT_IRON_1", "ITMT_ALUMI_1", "ITMT_COPPER_1", "ITMT_WOOD_1", "ITMT_OIL_1", "ITMT_FIBER_1"],
        "IRON" : ["ITMT_IRON_1", "ITMT_IRON_1", "ITMT_IRON_1", "ITMT_IRON_2"],
        "ALUMI" : ["ITMT_ALUMI_1", "ITMT_ALUMI_1", "ITMT_ALUMI_1", "ITMT_ALUMI_2"],
        "COPPER" : ["ITMT_COPPER_1", "ITMT_COPPER_1", "ITMT_COPPER_1", "ITMT_COPPER_2"],
        "WOOD" : ["ITMT_WOOD_1", "ITMT_WOOD_1", "ITMT_WOOD_1", "ITMT_WOOD_2"],
        "OIL" : ["ITMT_OIL_1", "ITMT_OIL_1", "ITMT_OIL_1", "ITMT_OIL_2"],
        "FIBER" : ["ITMT_FIBER_1", "ITMT_FIBER_2", "ITMT_FIBER_3", "ITMT_FIBER_4", "ITMT_FIBER_5"],
        "NONE": []

    }, //0-10
    {}, //11-20
    {}, //21-30
    {} //31-40
];
const tuberDrop = {
    "ZAKO_SCRATCH" : "ITMT_STONE_TBR_1",
    "ZAKO_TURRET" : "ITMT_STONE_TBR_2",
    "ZAKO_HOVERING" : "ITMT_STONE_TBR_3",
    "ZAKO_BONE" : "ITMT_STONE_TBR_4",
    "ZAKO_REVERSAL" : "ITMT_STONE_TBR_5"
};
const beastMushrooms = {
    "BST_FROG" : "MSR_031",
    "BST_RAT" : "MSR_033"
};
const gender = ["GENDER_MALE", "GENDER_FEMALE"];
const bodyId = [
    [["BODY_MALE_001","ASSET_MALE_BODY_001"],["BODY_MALE_002","ASSET_MALE_BODY_002"],["BODY_MALE_003","ASSET_MALE_BODY_003"],["BODY_MALE_004","ASSET_MALE_BODY_004"],["BODY_MALE_005","ASSET_MALE_BODY_005"]], //male
    [["BODY_FEMALE_001","ASSET_FEMALE_BODY_001"],["BODY_FEMALE_002","ASSET_FEMALE_BODY_002"],["BODY_FEMALE_003","ASSET_FEMALE_BODY_003"],["BODY_FEMALE_004","ASSET_FEMALE_BODY_004"],["BODY_FEMALE_005","ASSET_FEMALE_BODY_005"]], //female
];
const haid = [
  ["ASSET_MALE_HAIR_001","ASSET_MALE_HAIR_002","ASSET_MALE_HAIR_003","ASSET_MALE_HAIR_004","ASSET_MALE_HAIR_005"], //male
  ["ASSET_FEMALE_HAIR_001","ASSET_FEMALE_HAIR_002","ASSET_FEMALE_HAIR_003","ASSET_FEMALE_HAIR_004","ASSET_FEMALE_HAIR_005"]  //female
];
const equipment = [
    {
        "head" :["", "PT_DIY_HEAD_001", "PT_DIY_HEAD_003", "PT_DIY_HEAD_009"],
        "body" :["", "PT_DIY_TOPS_001", "PT_DIY_TOPS_003", "PT_DIY_TOPS_009"],
        "pants" :["", "PT_DIY_BTM_001", "PT_DIY_BTM_003", "PT_DIY_BTM_009"],
        "weapons" :[["",""], ["PT_ARM_WP001_001",""], ["PT_ARM_WP005_001","PT_ARM_WP011_001"], ["PT_ARM_WP012_001",""], ["","PT_ARM_WP017_001"]], //left and right
    }, //0-10
    {}, //11-20
    {}, //21-30
    {} //31-40
]


let floor = "";
let zombies = [];

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
                    addScreamer(pntlst, unit["unit"]);
                    break;
                case "TGTPNTTP_BST":
                    if (getRandomInt(2) === 1) { //50% chance to spawn any){
                        addBeast(pntlst, unit["unit"]);
                    }
                    break;
                case "TGTPNTTP_ITEM":
                    addItem(pntlst, unit["unit"]);
                    break;
                case "TGTPNTTP_BO": //box
                    addBox(pntlst, unit["unit"]);
                    break;
                case "TGTPNTTP_TRBOX": //chest
                    break;
                case "TGTPNTTP_ZAKO": //assume already filled
                    break;
            }

        });
    });
    addTuber();
    //change screamer to hunter
    addHater();
    //todo
    return floor;
};

function addTuber(){
    floor["flr"]["zks"].forEach(tuber=>{
       tuber["zkid"] = uuidv4();
        if(getRandomInt(2) === 1){
            tuber["rwd"]["items"].push(
                {
                    "eitemid": uuidv4(),
                    "itemId": tuberDrop[tuber["type"]],
                    "gettime": 0
                }
            );
        }
        else{
            tuber["rwd"]["money"] = getIntInRange(10, 1000)
        }
    });


    //todo
};

function addHater(){
    //add to zmbs
    //hater needs did? and uid?, clazz? might change also
    //add name, cname,
    floor["flr"]["zmbs"] = zombies
    //todo
};

function addScreamer(pntlst, unit){
    //add to zombies
    pntlst["pnts"].forEach(pnt=>{
        // make zombie
        let rwds = [""];
        let g = getRandomInt(1); //0 = male, 1 = female
        let body = bodyId[g][getRandomInt(bodyId[g].length)];
        let zid = uuidv4();
        let zmb = {
            "zid": zid,
            "did": -1,
            "uid": -1,
            "clazz": 0,
            "name": "",
            "cname": "",
            "body": {
                "id": body[0],
                "gender": gender[g],
                "baid": body[1],
                "haid": haid[g][getRandomInt(haid[g].length)],
                "colr": 1,
                "colg": 1,
                "colb": 1,
                "voicep": getIntInRange(1,5),//idk max,
                "voiceb": getIntInRange(1,5),//idk max
                "provoke": getIntInRange(1,20) //idk max
            },
            "gasmask": "",
            "attp": "ZMBATTP_PLAYER",
            "eqtp": "ZMBEQTP_NORMAL",
            "lvl": 1,
            "type": "BAL", //todo randomize
            "grade": 1,
            "limit_break": 0,
            "atkup": 0,
            "defup": 0,
            "exp": 2,
            "abp": 0,
            "prio": 1,
            "zako": 0,
            "path": "", //i hope i can just leave this blank
            "state": 1,
            "vip": 0,
            "pspts": [],
            "eqpts": [],
            "psskls": [],
            "mstlvl": [],
            "eqskls": [],
            "rwd": { //add after equipment gen
                "money": 0,
                "spirit": 0,
                "pts": [],
                "msrs": [],
                "items": [],
                "tbtp": ""
            },
            "stat": {
                "elms": []
            },
            "bodylvl": {
                "lvl": 1,
                "hp": getIntInRange(1,5),
                "str": getIntInRange(1,5),
                "dex": getIntInRange(1,5),
                "vit": getIntInRange(1,5),
                "stm": getIntInRange(1,5),
                "luk": getIntInRange(1,5),
                "skill": 0,
                "bag": 0
            },
            "bodybonus": {
                "hp_bonus": 0,
                "str_bonus": 0,
                "dex_bonus": 0,
                "vit_bonus": 0,
                "stm_bonus": 0,
                "luk_bonus": 0
            },
            "hunter": 0,
            "hp": 230, //has to be calculated
            "emblem": "",
            "teamname": "",
            "isduring": 0,
            "isfriend": 0,
            "bodymaxlvl": 6,
            "unit": unit,
            "pntid": pnt
        };
        let lvl = zmb["bodylvl"]["hp"] +
                    zmb["bodylvl"]["str"] +
                    zmb["bodylvl"]["dex"] +
                    zmb["bodylvl"]["vit"] +
                    zmb["bodylvl"]["stm"] +
                    zmb["bodylvl"]["luk"] -5;
        zmb["lvl"] = lvl;
        zmb["bodylvl"]["lvl"]= lvl;
        zmb["hp"] = 200 + 30* zmb["bodylvl"]["hp"]; //only works for 1 star

        //head
        let partId = equipment[0]["head"][getRandomInt(equipment[0]["head"].length)];
        if(partId !== ""){
            let part = makeEquipment(partId);
            part["zid"] = zid;
            zmb["pspts"].push(part);
            zmb["eqpts"].push({
                "eptid": part["eptid"],
                "site": "EQSITE_HEAD"
            });
            rwds.push(part);
        }
        //body
        partId = equipment[0]["body"][getRandomInt(equipment[0]["body"].length)];
        if(partId !== ""){
            let part = makeEquipment(partId);
            part["zid"] = zid;
            zmb["pspts"].push(part);
            zmb["eqpts"].push({
                "eptid": part["eptid"],
                "site": "EQSITE_BODY"
            });
            rwds.push(part);
        }
        //pants
        partId = equipment[0]["pants"][getRandomInt(equipment[0]["pants"].length)];
        if(partId !== ""){
            let part = makeEquipment(partId);
            part["zid"] = zid;
            zmb["pspts"].push(part);
            zmb["eqpts"].push({
                "eptid": part["eptid"],
                "site": "EQSITE_LEGS"
            });
            rwds.push(part);
        }
        //weapons
        partId = equipment[0]["weapons"][getRandomInt(equipment[0]["weapons"].length)];
        console.log(partId);
        if(partId[0] !== ""){
            let part = makeEquipment(partId[0]);
            part["zid"] = zid;
            zmb["pspts"].push(part);
            zmb["eqpts"].push({
                "eptid": part["eptid"],
                "site": "EQSITE_ARML"
            });
            rwds.push(part);
        }
        if(partId[1] !== ""){
            let part = makeEquipment(partId[1]);
            part["zid"] = zid;
            zmb["pspts"].push(part);
            zmb["eqpts"].push({
                "eptid": part["eptid"],
                "site": "EQSITE_ARML"
            });
            rwds.push(part);
        }
        let rwd = rwds[getRandomInt(rwds.length)];
        if(rwd === ""){
            zmb["rwd"]["money"] = getIntInRange(0, 500)
        }
        else{
            zmb["rwd"]["pts"] = {"eptid": rwd["eptid"]}
        }



        zombies.push(zmb)
    });
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
    //todo pool per floor range
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
    //todo pool per floor range
};

function addItem(pntlst, unit){
    let pool = [];
    if(floor["itemPool"])
        pool = floor["itemPool"];
    else
        if(floor["floorType"])
            pool = itemPool[0][floor["floorType"].toUpperCase()]; //todo find floor lvl
    pntlst["pnts"].forEach(pnt=> {
        let item = {
            "unit": unit,
            "pntid": pnt,
            "item": {
                "eitemid": uuidv4(),
                "itemId": pool[getRandomInt(pool.length)],
                "gettime": 0
            },
            "genid": "ITEM_GEN_30"
        };
        floor["flr"]["items"].push(item);
    });
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
    //todo add more options in box
};

function addChest(pntlst, unit){
    //just change inside? some are optional?
    //todo figure out how they spawn
};

exports.addJackleDrops =() => {
    //this will be a pain to actually test
    //todo
};

function makeEquipment(id){ //todo this is trash, need to fix, maybe keep templates of all equipment?
    return {
        "eptid": uuidv4(),
        "gettime": 0,
        "ptid": id,
        "rest": 3,
        "spare": 3,
        "grade": 0,
        "dur": 600,
        "lvl": 1,
        "zid": ""
    }
}

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