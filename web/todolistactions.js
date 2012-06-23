function init() {
    var container = document.getElementById("days-container");
    var divs = container.getElementsByTagName('div');
    for (var i in divs) {
        var textField = divs[i].getElementsByTagName('input')[0];
        var list = divs[i].getElementsByTagName('ul')[0];
        textField.onkeydown = createTypingHandler(textField, list)
    }
}

function createTypingHandler(textField, list) {
    return function(e) {
        if (typeof e == 'undefined' && window.event) {
            e = window.event;
        }
        if (e.keyCode == 13) {

            var text = textField.value;

            var newElement = document.createElement("li");
            newElement.innerHTML = text;
            list.appendChild(newElement);
            textField.value = ''
        }
    }
}
