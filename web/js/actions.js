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

function addTask(text, list, backgroundColor) {
    var createDataControl = function(text) {
        var result =
            $('<input type="checkbox"/>'
                + text
                + '<img src="img/delete_task.png" class="action-delete"/>'
                + '<img src="img/edit_task.png" class="action-edit"/>'
                + '<br>');
        $(result).siblings('img.action-edit').each(function() {
            $(this).click(function(e) {
                editTask($(this).parent('div.task'), e.pageX, e.pageY);
            })
        });
        $(result).siblings('img.action-delete').each(function() {
            $(this).click(function(e) {
                removeTask($(this).parent('div.task'));
            })
        });
        result.click(function(e) {
            var clazz = 'task-completed';
            if (e.target.checked) {
                $(e.target.parentElement).addClass(clazz);
            }
            else {
                $(e.target.parentElement).removeClass(clazz);
            }
        });
        return result;
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
                if (backgroundColor) {
                    $(this).css('background-color', backgroundColor);
                }
                added = true;
            }
        });
    }

    if (!added) {
        var task = $('<div class="task"></div>');
        task.addClass(parseListId(list[0]));
        task.draggable({ revert: "invalid" });
        if (checkBox) {
            checkBox.appendTo(task);
            task.css('background-color', backgroundColor);
        }
        else {
            task.draggable("option", "disabled", true);
        }
        task.appendTo($(list));
    }
}

function editTask(task, clickX, clickY) {
    var control = $("#task-details");

    // Display control in a way that it's located in the middle of the click position if possible.
    // Adjust its 'x' and 'y' coordinates if necessary.
    var x = clickX  - control.width() / 2;
    var xShift = x + control.width() - $(window).width();
    if (x < 0) {
        x = 20
    }
    else if (xShift > 0) {
        x -= xShift + 20;
    }

    var y = clickY - control.height() / 2;
    var yShift = y + control.height() - $(window).height();
    if (y < 0) {
        y = 20;
    }
    else if (yShift > 0) {
        y -= yShift + 20;
    }

    control.css('left', x + 'px');
    control.css('top', y + 'px');
    control.css('display', 'block');
}

function removeTask(task) {
    $(task).remove();
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
                addTask(ui.draggable.text(), destinationList, ui.draggable.css('background-color'));
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
    $('td').each(function (i) {
        var cell = $(this);
        cell.droppable({
            tolerance: 'pointer',
            accept: 'div.task',
            drop: function(event, ui) {
                var task = ui.draggable;
                task.css('background-color', cell.css('background-color'));
                task.css('left', '');
                task.css('top', '');
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
        ensureTasksNumber(list);

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