$(document).ready(function () {
    initTasks();
    initDragAndDrop();
    initCalendar();
    initDates();
});

function addTask(text, list) {
    var added = false;
    var htmlToSet = text ? '<input type="checkbox">' + text +'<br>' : '';
    if (text) {
        $('div.task', list).each(function () {
            if (added) {
                return;
            }
            if (this.innerHTML == '') {
                this.innerHTML = htmlToSet;
                added = true;
            }
        });
    }

    if (!added) {
        $('<div class="task">' + htmlToSet + '</div>').appendTo(list);
    }
}

function ensureTasksNumber(list) {
    var minNumber = 10;
    var toAdd = minNumber - $('div.task', list).length;
    if (toAdd <= 0) {
        return;
    }
    for (var i = 0; i < toAdd; i++) {
        addTask('', list)
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
                var sourceList = findList(event.toElement);
                var destinationList = findList(event.target);
                if (!destinationList) {
                    return;
                }
                addTask($(event.toElement).text(), destinationList);
                $('.ui-draggable-dragging').hide();

                $(event.toElement).remove();
                if (sourceList) {
                    ensureTasksNumber(sourceList);
                }
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
    var tomorrow = Date.today().add(1).days();
    var format = 'MMMM dd, yyyy';

    $('#today-date')[0].innerHTML = Date.today().toString(format);
    $('#tomorrow-date')[0].innerHTML = tomorrow.toString(format);
    $('#tomorrow-week-date')[0].innerHTML = tomorrow.toString('dddd');
}

function initCalendar() {
}

