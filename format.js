const readLine = require('readline');
const f = require('fs');
var file = './jokes.txt';
var out = './jokes.json';
var rl = readLine.createInterface({
    input : f.createReadStream(file),
    output : process.stdout,
    terminal: false
});
rl.on('line', function (text) {
    let positions = [];
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == '\"') {
                positions.push(i);
        }
    }
    while (positions.length > 0) {
        let index = positions.pop();
        let sep1 = text.substring(0, index);
        let sep2 = text.substring(index, text.length);
        text = sep1 + '\\' + sep2;
    }
    f.appendFile(out, "\"" + text + "\",\n", (err) => {
        if (err != null) {
            console.log(err);
        }
    });
});