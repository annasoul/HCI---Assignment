$(document).ready(function () {
    initEscapeHandler();
    initTasks();
    initDayDragAndDrop();
    initPriorityDragAndDrop();
    initCalendar();
    initDates();
    initEditTaskActions();
});

function closePopups() {
    $('#task-details').css('display', 'none');
    $('#task-delegate').css('display', 'none');
}

function initEscapeHandler() {
    var controls = [ $('#task-details'), $('#task-delegate') ];

    // Cancel editing on 'click outside edit control'.
    $(document).on('click', function (e) {
        for (var i in controls) {
            if ($(e.target).closest(controls[i][0]).length === 0) {
                controls[i].css('display', 'none');
            }
        }
    });

    // Cancel editing on 'Escape'.
    $(document).on('keydown', function (e) {
        if (e.keyCode !== 27) { // ESC
            return
        }
        closePopups();
    });
}

function parseListId(e) {
    var classes = e.className.split(' ');
    for (var i in classes) {
        if (classes[i].indexOf('myListId') == 0) {
            return classes[i]
        }
    }
    return null;
}

function addTask(text, list, backgroundColor, comment) {
    var createDataControl = function(text) {
        var result =
            $('<input type="checkbox"/>'
                + '<span>' + text + '</span>'
                + '<img src="img/delete_task.png" class="action-delete"/>'
                + '<img src="img/delegate.png" class="action-delegate"/>'
                + '<img src="img/edit_task.png" class="action-edit"/>'
                + '<br>');
        $(result).siblings('img.action-delete').each(function() {
            $(this).click(function(e) {
                removeTask($(this).parent('div.task'));
            })
        });
        $(result).siblings('img.action-delegate').each(function() {
            $(this).click(function(e) {
                closePopups();
                delegateTask($(this).parent('div.task'), $(this));
                e.stopPropagation();
            })
        });
        $(result).siblings('img.action-edit').each(function() {
            $(this).click(function(e) {
                closePopups();
                editTask($(this).parent('div.task'), $(this));
                e.stopPropagation();
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
                if (comment) {
                    this.myComment = comment;
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
            if (comment) {
                task[0].myComment = comment;
            }
        }
        else {
            task.draggable("option", "disabled", true);
        }
        task.appendTo($(list));
    }
}

/**
 *
 * @param task            jquery object
 * @param delegateButton  jquery object
 */
function delegateTask(task, delegateButton) {
    var control = showControl(task, delegateButton, 'task-delegate');
    $('#task-delegate-name').val($("span", task).text());
    control[0].myTask = task;
    $('#task-delegate-name').css('background-color', task.css('background-color'));
}

/**
 *
 * @param task        jquery object
 * @param editButton  jquery object
 */
function editTask(task, editButton) {
    var control = showControl(task, editButton, 'task-details');
    $('#task-name').val($("span", task).text());
    var comment = task[0].myComment;
    if (!comment) {
        comment = '';
    }
    $('#task-comment').val(comment);
    control[0].myTask = task;
    $('#task-name').css('background-color', task.css('background-color'));
}

/**
 *
 * @param task    jquery object
 * @param button  jquery object
 * @return        jquery wrapper for the control object
 */
function showControl(task, button, controlId) {
    var control = $('#' + controlId);

    // Display control in a way that it's top right corner is located below the bottom right icon corner if possible.
    // Adjust its 'x' and 'y' coordinates if necessary.
    var x = button.offset().left + button.width() - control.outerWidth(true);
    var xShift = x + control.outerWidth(true) - $(window).width();
    if (xShift > 0) {
        x -= xShift;
    }
    if (x < 20) {
        x = 20
    }

    var y = task.offset().top + task.height();
    var yShift = y + control.height() - $(window).height();
    if (yShift > 0) {
        y -= yShift - 20;
    }
    if (y < 0) {
        y = 20;
    }

    control.css('left', x + 'px');
    control.css('top', y + 'px');
    control.css('display', 'block');
    return control;
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
                var task = ui.draggable;
                var sourceList = findList(task[0]);
                var destinationList = findList(event.target);
                if (!destinationList) {
                    return;
                }
                addTask(task.text(), destinationList, task.css('background-color'), task[0].myComment);
                $('.ui-draggable-dragging').hide();

                task.remove();
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

function initEditTaskActions() {
    $('#task-details-button-cancel').click(function(e) {
        $('#task-details').css('display', 'none');
    });

    $('#task-details-button-ok').click(function(e) {
        var editControl = $('#task-details');

        // Save task name.
        $('span', editControl[0].myTask).text($('#task-name').val());

        // Save comment.
        editControl[0].myTask[0].myComment = $('#task-comment').val();
        editControl.css('display', 'none');
    });
}