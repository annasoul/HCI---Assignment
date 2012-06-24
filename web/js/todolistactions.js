function init() {
    var container = document.getElementById("days-container");
    var divs = container.getElementsByTagName('div');
    for (var i in divs) {
        if (divs[i].className != 'day') {
            continue;
        }
        var textField = divs[i].getElementsByTagName('input')[0];
        var list = find(divs[i], 'div', 'list');
        textField.onkeydown = createTypingHandler(textField, list)
    }

    var somedayTextField = document.getElementById('someday-todo-text');
    var somedayList = document.getElementById('someday-list');
    somedayTextField.onkeydown = createTypingHandler(somedayTextField,somedayList);
}

function createTypingHandler(textField, list) {
    return function(e) {
        if (typeof e == 'undefined' && window.event) {
            e = window.event;
        }
        if (e.keyCode == 13) {

            var text = textField.value;

            if(text != ''){
            var newElement = document.createElement("div");
            newElement.className = 'task';
            newElement.innerHTML = text;
            list.appendChild(newElement);
            textField.value = ''
            }
        }
    }
}

function find(parent, tagName, className) {
    var children = parent.getElementsByTagName(tagName);
    for (i in children) {
        var child = children[i];
        if (child.className == className) {
            return child
        }
    }
    return null
}
