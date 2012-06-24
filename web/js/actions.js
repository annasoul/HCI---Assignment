$(document).ready(function () {
    initTasks();
    initCalendar();
    initDates();
});

function initTasks() {
    $('div.day').each(function (i) {
        var textField = $('input', this);
        var list = $('div.list', this);

        // Add empty cells.
        for (var j = 0; j < 10; j++) {
            $('<div class="task"></div>').appendTo(list);
        }

        // Setup typing handler.
        textField.bind('keypress', function (e) {
            var innerHtml = '<input type="checkbox">' + textField.val() +'<br>';

            if (e.keyCode == 13 && textField.val() != '') {
                var added = false;
                var tasks = $('div.task', list).each(function () {
                    if (added) {
                        return;
                    }
                    if (this.innerHTML == '') {
                        this.innerHTML = innerHtml;
                        added = true;
                    }
                });

                if (!added) {
                    $('<div class="task">' + innerHtml + '</div>').appendTo(list);
                }

                //clear text field
                textField.val('')
            }
        });
    })
}

function initDates() {

}

function initCalendar() {
}

