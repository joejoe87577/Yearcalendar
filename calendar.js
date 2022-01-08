function Calendar(elem, opt) {
    this.element = elem;

    if (opt == null) {
        opt = {};
    }

    this.init = function (options) {
        console.debug('init called');
        console.debug('init on element: ' + this.element);
        console.debug('init with options: ' + JSON.stringify(options));

        this.options = {
            start: !isNaN(parseInt(opt.start)) ? parseInt(opt.start) : new Date().getFullYear(),
            lang: opt.lang != null ? opt.lang : 'en',
            header: opt.header != null ? opt.header : true,
            // see https://tc39.es/ecma402/#datetimeformat-objects
            dayDateTimeFormat: opt.dayDateTimeFormat != null ? opt.dayDateTimeFormat : { day: '2-digit', weekday: 'short' },
            monthDateTimeFormat: opt.monthDateTimeFormat != null ? opt.monthDateTimeFormat : { month: 'long' },
            headerDateTimeFormat: opt.headerDateTimeFormat != null ? opt.headerDateTimeFormat : { year: 'numeric' },
            onDayClick: opt.onDayClick != null ? opt.onDayClick : null,
            onYearChange: opt.onYearChange != null ? opt.onYearChange : null,
            onYearChanged: opt.onYearChanged != null ? opt.onYearChanged : null
        }

        console.debug('used options: ' + JSON.stringify(this.options));

        this.currentYear = this.options.start;

        this.render();
    }

    this.render = function () {
        console.debug('render called for year ' + this.currentYear);

        // remove all childElements inside of calendar div
        while (this.element.firstChild) {
            this.element.firstChild.remove()
        }

        this.element.classList.add('calendar');
        this.element.calendar = this;

        if (this.options.header)
            this.renderHeader();

        var monthDiv, monthHeaderDiv, dayDiv;
        var monthDate;
        for (i = 0; i < 12; i++) {
            monthDiv = document.createElement('div');
            monthDiv.classList.add('month', 'month-' + i);

            monthDate = new Date(this.currentYear, i, 1);

            monthHeaderDiv = document.createElement('div');
            monthHeaderDiv.classList.add('month-header');
            monthHeaderDiv.innerText = new Intl.DateTimeFormat(this.options.lang, this.options.monthDateTimeFormat).format(monthDate);
            monthDiv.appendChild(monthHeaderDiv);

            for (j = 1; j <= new Date(this.currentYear, i, 1).daysOfMonth(); j++) {
                monthDiv.appendChild(this.renderDay(new Date(this.currentYear, i, j)));
            }

            if (new Date(this.currentYear, i, 1).daysOfMonth() < 31) {
                for (j = 0; j < 31 - new Date(this.currentYear, i, 1).daysOfMonth(); j++) {
                    dayDiv = document.createElement('div');
                    dayDiv.classList.add('day', 'day-filler');
                    monthDiv.appendChild(dayDiv);
                }
            }

            this.element.appendChild(monthDiv);
        }

        console.debug('render complete for year ' + this.currentYear);
    }

    this.renderHeader = function () {
        console.debug('renderHeader called for year ' + this.currentYear);

        var yearHeader = document.createElement('div');
        yearHeader.classList.add('year-header');
        yearHeader.innerText = new Intl.DateTimeFormat(this.options.lang, this.options.headerDateTimeFormat).format(new Date(this.currentYear, 0, 1));

        var btnPrev = document.createElement('input');
        btnPrev.type = 'button';
        btnPrev.value = '<<';
        btnPrev.calendar = this;
        btnPrev.addEventListener('click', function (event) {
            event.currentTarget.calendar.changeYear(event.currentTarget.calendar.currentYear - 1);
        });
        yearHeader.appendChild(btnPrev);

        var btnNext = document.createElement('input');
        btnNext.type = 'button';
        btnNext.value = '>>';
        btnNext.calendar = this;
        btnNext.addEventListener('click', function (event) {
            event.currentTarget.calendar.changeYear(event.currentTarget.calendar.currentYear + 1);
        });
        yearHeader.appendChild(btnNext);

        this.element.appendChild(yearHeader);
    }

    this.renderDay = function (dayDate) {
        console.debug('renderDay called for date ' + dayDate);

        var dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'day-' + j);

        // check if day is weekend
        if (dayDate.getDay() == 0 || dayDate.getDay() == 6) {
            dayDiv.classList.add('day-weekend');
            dayDiv.weekend = true;
        } else {
            dayDiv.dataset['weekend'] = false;
            dayDiv.weekend = false;
        }

        dayDiv.date = dayDate;
        dayDiv.year = dayDate.getFullYear();
        dayDiv.month = dayDate.getMonth();
        dayDiv.day = dayDate.getDate();

        var dayDivSpan = document.createElement('span');
        dayDivSpan.innerText = new Intl.DateTimeFormat(this.options.lang, this.options.dayDateTimeFormat).format(dayDate);

        dayDiv.appendChild(dayDivSpan);

        if (this.options.onDayClick != null) {
            dayDiv.addEventListener('click', this.options.onDayClick);
        }
        return dayDiv;
    }

    this.changeYear = function (year) {
        var previousYear = this.currentYear;
        if (opt.onYearChange != null) {
            opt.onYearChange(this, previousYear, year);
        }

        this.currentYear = year;

        this.render();

        if (opt.onYearChanged != null) {
            opt.onYearChanged(this, previousYear, year);
        }
    }

    this.init(opt);
}

Date.prototype.daysOfMonth = function () {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
}

Date.prototype.addDays = function (days) {
    var date = this.setDate(this.getDate() + days);
    return date;
}