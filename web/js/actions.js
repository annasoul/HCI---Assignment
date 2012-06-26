$(document).ready(function () {
    initTasks();
    initDayDragAndDrop();
    initPriorityDragAndDrop();
    initCalendar();
    initDates();
});

function parseListId(e) {
    var classes = e.className.split(' ');
    for (var i in classes) {
        if (classes[i].indexOf('myListId') == 0) {
            return classes[i]
        }
    }
    return null;
}

function addTask(text, list) {
    var createDataControl = function(text) {
        var checkBox = $('<input type="checkbox">' + text +'<br>');
        checkBox.click(function(e) {
            var clazz = 'task-completed';
            if (e.target.checked) {
                $(e.target.parentElement).addClass(clazz);
            }
            else {
                $(e.target.parentElement).removeClass(clazz);
            }
        });
        return checkBox;
    };

    var added = false;
    var checkBox = text ? createDataControl(text) : null;
    if (text) {
        $('div.task', list).each(function () {
            if (added) {
                return;
            }

            if (this.innerHTML == '') {
                checkBox.appendTo($(this));
                $(this).draggable("option", "disabled", false);
                added = true;
            }
        });
    }

    if (!added) {
        var task = $('<div class="task"></div>');
        task.addClass(parseListId(list));
        task.draggable({ revert: "invalid" });
        if (checkBox) {
            checkBox.appendTo(task);
        }
        else {
            task.draggable("option", "disabled", true);
        }
        task.appendTo($(list));
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

function initDayDragAndDrop() {
    var findList = function(startChild) {
        for (var e = startChild; e; e = e.parentElement) {
            if ($(e).hasClass('list')) {
                return e;
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
                var sourceList = findList(ui.draggable[0]);
                var destinationList = findList(event.target);
                if (!destinationList) {
                    return;
                }
                addTask(ui.draggable.text(), destinationList);
                $('.ui-draggable-dragging').hide();

                ui.draggable.remove();
                if (sourceList) {
                    ensureTasksNumber(sourceList);
                }
            }
        });
    })
}

function initPriorityDragAndDrop() {
//    $('#matrix').droppable({
//        drop: function(event, ui) {
//            console.log('drop complete');
//        }
//    });
    $('td').each(function (i) {
        var cell = $(this);
        cell.droppable({
            tolerance: 'pointer',
//            accept: function(drop) {
//                return true;
//            },
            accept: 'div.task',
            drop: function(event, ui) {
                var task = ui.draggable;
                task.css('background-color', cell.css('background-color'));
                task.css('left', '');
                task.css('top', '');
//                $('.ui-draggable-dragging').hide();
            }
        })
    });
}

function initTasks() {
    $('div.day').each(function (listId) {
        var textField = $('input', this);
        var list = $('div.list', this);
        $(list).addClass('myListId' + listId);

        // Add empty cells.
        ensureTasksNumber(list[0]);

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