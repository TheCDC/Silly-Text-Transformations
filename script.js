var inputArea = document.getElementById("inputArea");
var outputArea = document.getElementById("outputArea");

function splitWordsAndPunctuation(s) {
    var wordPattern = /[\w-']+|[^\w]+/g;
    allWords = s.match(wordPattern);
    return allWords;
}

function swapFirstLastLetter(s) {
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function translateWord(word) {
        var a = word.split("");
        if (word.length > 2) {
            var head = a[0];
            var tail = a[a.length - 1];
            var body = shuffle(a.slice(1, a.length - 1)).join("");
            return head + body + tail;
        } else {
            return word;
        }
    }

    function translateText(text) {
        var allWords = splitWordsAndPunctuation(s);
        allWords.forEach(function(element, index) {
            if (element.length > 0 && alphas.has(element[0].toLowerCase())) {

                allWords[index] = translateWord(element);
            }
        });
        return allWords.join("");
    }
    return translateText(s);
}

function justHello(s) {
    return "Hello!";
}

function reverseString(s) {
    return s.split("").reverse().join("");
}

var vowels = new Set("aeiouy");
var consonants = new Set("bcdfghjklmnpqrstvwxz");
var alphas = new Set([...vowels, ...consonants]);

function first_sound_group(s) {
    var state = 0;
    var consonantIdx = 0;
    for (var i = 0; i < s.length; i++) {
        if (state === 0) {
            if (vowels.has(s.toLowerCase()[i])) {
                state = 1;
            }
        } else if (state === 1) {
            if (consonants.has(s[i].toLowerCase())) {
                consonantIdx = i;
                return s.slice(0, consonantIdx + 1);
                break;
            }
        }

        // statement
    }
    return s;
}

function covfefifyWord(s) {
    var xlat = {
        h: "h",
        r: "r",
        n: "n",
        c: "g",
        l: "l",
        x: "x",
        w: "w",
        q: "q",
        g: "k",
        f: "v",
        m: "m",
        b: "p",
        s: "z",
        j: "j",
        d: "t",
        k: "g",
        t: "d",
        z: "s",
        v: "f",
        p: "b"
    };
    // console.log(vowels);
    // console.log(consonants);

    var soundGroup = first_sound_group(s);
    var startIndex = soundGroup.length;
    var v = "";
    for (var i = startIndex; i < s.length; i++) {
        if (vowels.has(s[i].toLowerCase())) {
            v = s[i];
            break;
        }
    }
    var lastLetter = soundGroup[soundGroup.length - 1];
    var rotated = xlat[lastLetter];
    if (rotated == null) {
        return s;
    } else {
        return soundGroup + (rotated + v).repeat(2);
    }

    return soundGroup;
}

function covfefify(s) {
    // var wordPattern = /[,.!?;:]|\b[1-9a-z']+\b/ig;
    allWords = splitWordsAndPunctuation(s);
    out = new Array();
    allWords.forEach(function(element, index) {
        if (element.length > 0) {
            if (alphas.has(element[0].toLowerCase())) {
                out.push(covfefifyWord(element));
            } else {
                out.push(element);
            }
        }
    });
    // return JSON.stringify(out);
    return out.join("");
}

function asian(s) {
    return s.split("l").join("r").split("L").join("R");
}

class TransformationSelector {
    constructor() {
        this.nameToFunc = {};
        this.selected = [];
        this.unSelected = [];
        this.delegate = null;
    }
    registerTransformation(func, name) {
        this.nameToFunc[name] = func;
        this.unSelected.push(name);
        this.unSelected.sort();
    }

    selectByIndex(index) {
        if (index > -1) {
            var funcName = this.unSelected[index];
            this.selected.push(funcName);
            this.unSelected.splice(index, 1);
        }
        this.delegate();
    }
    unSelectByIndex(index) {
        if (index > -1) {
            var funcName = this.selected[index];
            this.unSelected.push(funcName);
            this.unSelected.sort();
            this.selected.splice(index, 1);
        }
        this.delegate();
    }
    getProcessedText(raw) {
        var out = raw;

        for (var i = 0; i < this.selected.length; i++) {
            var funcName = this.selected[i];
            out = this.nameToFunc[funcName](out);
        }
        return out;
    }
    registerDelegate(func) {
        this.delegate = func;
    }
    render(root) {
        //  table t1
        //      row r1
        //          col c1
        //              select s1
        //                  option(s)
        //          col c2
        //              table t2
        //                  row r2
        //                      col c3
        //                          button b1
        //                  row r3
        //                      col c4
        //                          button b2
        //          col c5
        //              select s2
        //                  options(s)

        while (root.hasChildNodes()) {
            root.removeChild(root.lastChild);
        }

        var t1 = document.createElement("table");
        root.appendChild(t1);

        var r1 = t1.insertRow();

        var c1 = r1.insertCell();

        var s1 = document.createElement("select");
        s1.size = 10;
        c1.appendChild(s1);

        this.unSelected.forEach(function(element, index) {
            var row = document.createElement("option");
            row.text = element;
            row.value = element;
            s1.appendChild(row);
        });

        var c2 = r1.insertCell();

        var t2 = document.createElement("table");
        c2.appendChild(t2);

        var r2 = t2.insertRow();
        var c3 = r2.insertCell();
        var b1 = document.createElement("button");
        b1.innerHTML = ">";
        b1.addEventListener(
            "click",
            function() {
                this.selectByIndex(s1.selectedIndex);
                this.render(document.getElementById("managerView"));
            }.bind(this)
        );
        c3.appendChild(b1);

        var r3 = t2.insertRow();
        var c4 = r3.insertCell();
        var b2 = document.createElement("button");
        b2.innerHTML = "<";
        c4.appendChild(b2);

        var c5 = r1.insertCell();
        var s2 = document.createElement("select");
        s2.size = 10;
        c5.appendChild(s2);

        this.selected.forEach(function(element, index) {
            var row = document.createElement("option");
            row.text = element;
            row.value = element;
            s2.appendChild(row);
        });
        // can only now create listener for b2 because its select element didn't exist yet
        b2.addEventListener(
            "click",
            function() {
                this.unSelectByIndex(s2.selectedIndex);
                this.render(document.getElementById("managerView"));
            }.bind(this)
        );
    }
}

function main() {
    var manager = new TransformationSelector();
    manager.registerTransformation(swapFirstLastLetter, "Heads and tails");
    manager.registerTransformation(justHello, "Just Hello [test]");
    manager.registerTransformation(reverseString, "Reverse");
    manager.registerTransformation(asian, "Far East Stereotype");
    manager.registerTransformation(covfefify, "Covfefify");
    // manager.selectByIndex(0);
    // manager.selectByIndex(1);
    console.log(JSON.stringify(manager));

    var managerViewElement = document.getElementById("managerView");
    manager.render(managerViewElement);
    // defaults

    var processInput = function() {
        var inText = inputArea.value;
        outputArea.value = manager.getProcessedText(inText);

        manager.render(managerViewElement);
    };
    manager.registerDelegate(processInput);

    // listeners
    // transformation trigger
    inputArea.addEventListener("input", processInput);

    var mainLoop = function() {
        console.log("loop");

        processInput();
        setTimeout(mainLoop, 2000);
    };
    processInput();
}
main();
