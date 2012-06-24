$(document).ready(function () {
    initTasks();
    initCalendar();
});

function initTasks() {
    $('#days-container div.day').each(function (i) {
        var textField = $('input', this);
        var list = $('div.list', this);

        // Add empty cells.
        for (var j = 0; j < 10; j++) {
            $('<div class="task"></div>').appendTo(list);
        }

        // Setup typing handler.
        textField.bind('keypress', function (e) {
            if (e.keyCode == 13 && textField.val() != '') {
                var added = false;
                var tasks = $('div.task', list).each(function () {
                    if (added) {
                        return;
                    }
                    if (this.innerHTML == '') {
                        this.innerHTML = textField.val();
                        added = true;
                    }
                });

                if (!added) {
                    $('<div class="task">' + textField.val() + '</div>').appendTo(list);
                }

                //clear text field
                textField.val('')
            }
        });
    })
}

function initCalendar() {
    Calendar.setup({
        trigger    : "img-calendar1",
        inputField : "input-calendar1",
        bottomBar: false
    });
}