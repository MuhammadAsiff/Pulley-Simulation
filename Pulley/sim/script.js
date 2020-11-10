// Global variables
var category = "";
var page = " ";



var values = { // m for model
    m_pulley: 0, // Already pulled from smartsparrow. How to I set random inputs?
    k: 0,
    M_1: 0,
    m_2: 0,
    R: 0,
    r: 0,
    I_o: 0,
    alpha: 0,
    a_1: 0,
    a_2: 0,
    X: 0,
    T: 0,
    V_1: 0,
    KE_1: 0,
    KE_2: 0,
    KE_pulley: 0,
    KE_total: 0,
};

var valuesRounded = {
    m_pulley: 0,
    k: 0,
    M_1: 0,
    m_2: 0,
    R: 0,
    r: 0,
    I_o: 0,
    alpha: 0,
    a_1: 0,
    a_2: 0,
    X: 0,
    T: 0,
    V_1: 0,
    KE_1: 0,
    KE_2: 0,
    KE_pulley: 0,
    KE_total: 0,
};

var names = { //choose how to write variable string.
    m_pulley: "m<sub>pulley</sub>", // Already pulled from smartsparrow. How to I set random inputs?
    k: "k",
    M_1: "M",
    m_2: "m",
    R: "R",
    r: "r",
    I_o: "I<sub>o</sub>",
    alpha: "&#945;",
    a_1: "a<sub>1</sub>",
    a_2: "a<sub>2</sub>",
    X: "X",
    T: "T",
    V_1: "V",
    KE_1: "KE<sub>1</sub>",
    KE_2: "KE<sub>2</sub>",
    KE_pulley: "KE<sub>pulley</sub>",
    KE_total: "KE<sub>total</sub>",
};

var units = { //write the units
    m_pulley: "kg", // Already pulled from smartsparrow. How to I set random inputs?
    k: "m",
    M_1: "kg",
    m_2: "kg",
    R: "m",
    r: "m",
    I_o: "kgm<sup>2</sup>",
    alpha: "rad/s<sup>2</sup>",
    a_1: "m/s<sup>2</sup>",
    a_2: "m/s<sup>2</sup>",
    X: "m",
    T: "s",
    V_1: "m/s",
    KE_1: "J",
    KE_2: "J",
    KE_pulley: "J",
    KE_total: "J",

};


// Get values from SS
var model = new pipit.CapiAdapter.CapiModel({
    m_pulley: 0,
    k: 0,
    M_1: 0,
    m_2: 0,
    R: 0,
    r: 0,
    I_o: 0,
    alpha: 0,
    a_1: 0,
    a_2: 0,
    X: 0,
    T: 0,
    V_1: 0,
    KE_1: 0,
    KE_2: 0,
    KE_pulley: 0,
    KE_total: 0,
    page: "10",
});
// I think this exposes the values to Smart Sparrow. :D
pipit.CapiAdapter.expose('m_pulley', model);
pipit.CapiAdapter.expose('k', model);
pipit.CapiAdapter.expose('M_1', model);
pipit.CapiAdapter.expose('m_2', model);
pipit.CapiAdapter.expose('R', model);
pipit.CapiAdapter.expose('r', model);
pipit.CapiAdapter.expose('I_o', model);
pipit.CapiAdapter.expose('alpha', model);
pipit.CapiAdapter.expose('a_1', model);
pipit.CapiAdapter.expose('a_2', model);
pipit.CapiAdapter.expose('X', model);
pipit.CapiAdapter.expose('T', model);
pipit.CapiAdapter.expose('V_1', model);
pipit.CapiAdapter.expose('KE_1', model);
pipit.CapiAdapter.expose('KE_2', model);
pipit.CapiAdapter.expose('KE_pulley', model);
pipit.CapiAdapter.expose('KE_total', model);

pipit.CapiAdapter.expose('page', model);


//this gets the values from Smart Sparrow. So does that mean I need to put inputs into Smart Sparrow variable tab? Either way, I'm sure these are just the inputs
//I think I can place M R theta_deg in variables. Then make pages # in iniitial state. Then i'm done??!
pipit.Controller.notifyOnReady();


model.on("change:m_pulley", function() {
    draw();
});
model.on("change:k", function() {
    draw();
});
model.on("change:M_1", function() {
    draw();
});
model.on("change:R", function() {
    draw();
});
model.on("change:r", function() {
    draw();
});
model.on("change:X", function() {
    draw();
});
model.on("change:page", function() {
     draw();
});

// This is JQuery right? 
$("#selectBox").change(function() {
    draw();
});

//this is the generic function which does all the magic. It gets the values from SS then calculates them then figures out which catagory its in (how does it know what question #? from getvaleusformSS function!!) then displays the values
function draw() {
    getValuesFromSS();
    calculateVariables();

    category = $("#selectBox option:selected").val();
    sendValuesToSS();
    displayValues();
}

//there is no need to send the input values back to smart sparrow. so only send the values that have been calculated.
function sendValuesToSS() {
    model.set("I_o", values.I_o);
    model.set("alpha", values.alpha);
    model.set("a_1", values.a_1);
    model.set("a_2", values.a_2);
    model.set("T", values.T);
    model.set("V_1", values.V_1);
    model.set("KE_1", values.KE_1);
    model.set("KE_2", values.KE_2);
    model.set("KE_pulley", values.KE_pulley);
    model.set("KE_total", values.KE_total);
}
// what is the purpose of the num == 4 ? Is this to make it fit to the table somehow?
function displayValues() {
    var show = getShowVariables();
    var s = "<table class=right><tr><td>";
    var num = 1;

    $.each(show, function(i, e) {
        var name = names[e]; // objects can reference members by object.property or by object['property'], allowing you to use variables
        var value = valuesRounded[e];
        var unit = units[e];

        s += name + " = " + value + " " + unit + "<br>";

        if (num == 4) {
            s += "</td><td>";
            num = 0
        }
        num++;

    });

    s += "</td></tr></table>";

    $("#right")[0].innerHTML = s;
}

// Here i'm getting all the inputs from Smart Sparrow. This is the start of the draw function. Only put in inputs because other variables won't be there
function getValuesFromSS() {
    values.m_pulley = model.get('m_pulley');
    values.k = model.get('k');
    page = model.get('page');
    values.M_1 = model.get('M_1');
    values.m_2 = model.get('m_2');
    values.R = model.get('R');
    values.r = model.get('r');
    values.X = model.get('X');
}
//ones the inputs are pulled from Smart Sparrow then they're calculated (all part of the draw function). Make sure I start from elementary formulas and work done.
function calculateVariables() {
    values.I_o = values.m_pulley * values.k * values.k;
    values.alpha = (values.M_1*9.81*values.R - values.m_2*9.81*values.r)/(values.I_o + values.M_1*values.R*values.R + values.m_2*values.r*values.r);
    values.a_1 = values.R * values.alpha;
    values.a_2 = values.r * values.alpha;
    values.T = Math.sqrt(2*values.X/values.a_1);
    values.V_1 = values.a_1 * values.T;
    values.KE_1 = 0.5 * values.M_1 * values.V_1 * values.V_1;
    values.KE_2 = 0.5 * values.m_2 * (values.V_1 * values.r / values.R) * (values.V_1 * values.r / values.R);
    values.KE_pulley = 0.5 * values.I_o * (values.V_1 / values.R) * (values.V_1 / values.R);
    values.KE_total = values.KE_1 + values.KE_2 + values.KE_pulley;

    // Round values into valuesRounded
    $.each(values, function(i, e) {
        valuesRounded[i] = round(values[i]);
    })
}
// case 1 = catagory 1. Is the order determiend by the order in the HTML code?
// page 3 = 30. Page 3 from start of SS tutorial? Start at page 0 or page 1? Why is crank shaft velocity page 1??!
// For case 1, pages 3,4,5,6,7,8 and 9 are all taken care of by the one return line. right?
// what is the max number of variables per category??
// what happens if I have less than 5 categories? How do I specify 3 categories for example?
function getShowVariables() {
    switch (category) {
        case "1": // Category 1
            switch (page) {
                case "10":
                    return ["m_pulley", "M_1", "m_2", "k", "R", "r"] 
                    break;
                case "20": 
                case "30": 
                case "40": 
                case "50":
                case "60":
                    return ["m_pulley", "M_1", "m_2", "k", "R", "r", "X"]
                    break;
                case "70":
                case "80":
            }
            break;

        case "2": // Category 2
            switch (page) {
                case "10":
                case "20":
                case "30":
                    return [];
                    break;
                case "40":
                    return ["I_o"];
                    break;
                case "50":
                case "60":
                case "70":
                case "80":
                    return ["I_o", "alpha"];
                    break;
            }
            break;

        case "3":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                    return [];
                    break;
                case "60":
                case "70":
                case "80":
                    return ["a_1", "a_2"];
                    break;
            }
            break;

        case "4":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                    return [];
                    break;
                case "70":
                    return ["T"];
                    break;
                case "80":
                    return ["T", "V_1"];
                    break;
            }
                break;

    }
    return []; // empty
}


function round(input) {
    // if it is an integer number, return it
    if (parseInt(input) == parseFloat(input)) {
        return input;
    }

    // if the input is NaN or not available or 0, dont round
    if (isNaN(input) == true || input == " " || input == 0) {
        return input;
    }

    //rounds if not an integer or NaN or "" or 0
    var i = Math.abs(input);
    var sigfig = 3
    var mag = Math.floor(Math.log10(i));
    input = input * Math.pow(10, sigfig - mag);
    input = Math.round(input)
    input = input / Math.pow(10, sigfig - mag);
        return input;
}
