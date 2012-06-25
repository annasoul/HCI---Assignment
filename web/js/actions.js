$(document).ready(function () {
    initTasks();
    initDragAndDrop();
    initCalendar();
    initDates();
});

function addTask(text, list) {
    var added = false;
    var htmlToSet = '<input type="checkbox">' + text +'<br>';
    var tasks = $('div.task', list).each(function () {
        if (added) {
            return;
        }
        if (this.innerHTML == '') {
            this.innerHTML = htmlToSet;
            added = true;
        }
    });

    if (!added) {
        $('<div class="task">' + htmlToSet + '</div>').appendTo(list);
    }
}

function initDragAndDrop() {
    var findList = function(startChild) {
        for (var e = startChild; e; e = e.parentElement) {
            if ($(e).hasClass('list')) {
                return e;
            }
        }
        return null;
    };

    var parseListId = function(e) {
        var classes = e.className.split(' ');
        for (var i in classes) {
            if (classes[i].indexOf('myListId') == 0) {
                return classes[i]
            }
        }
        return null;
    };

    $('div.day div.list').each(function (i) {
        var list = $(this);
        var listId = parseListId(this);
        list.droppable({
            accept: 'div.task:not(.' + listId + ')',
            drop: function(event, ui) {
                var list = findList(event.target);
                if (!list) {
                    return;
                }
                addTask($(event.toElement).text(), list);
                $('.ui-draggable-dragging').hide();
            }
        });
    })
}

function initTasks() {
    $('div.day').each(function (listId) {
        var textField = $('input', this);
        var list = $('div.list', this);
        $(list).addClass('myListId' + listId);

        // Add empty cells.
        for (var j = 0; j < 10; j++) {
            var task = $('<div class="task"></div>');
            task.addClass('myListId' + listId)
            task.draggable({ revert: "invalid" });
            task.appendTo(list);
        }

        // Setup typing handler.
        textField.bind('keypress', function (e) {
            if (e.keyCode == 13 && textField.val() != '') {
                addTask(textField.val(), list);
                textField.val('');
            }
        });
    })
}

function initDates() {

}

function initCalendar() {
}

