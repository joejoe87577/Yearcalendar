function Calendar(elem, opt) {
    this.element = elem;

    if (opt == null) {
        opt = {};
    }

    this.init = function(options) {
        console.debug('init called');
        console.debug('init on element: ' + this.element);
        console.debug('init with options: ' + JSON.stringify(options));

        this.options = {
            start: !isNaN(parseInt(opt.start)) ? parseInt(opt.start) : new Date().getFullYear(),
            data: opt.data != null ? opt.data : null,
            lang: opt.lang != null ? opt.lang : 'en',
            header: opt.header != null ? opt.header : true,
            weeknumber: opt.weeknumber != null ? opt.weeknumber : true,
            btnNextText: opt.btnNextText != null ? opt.btnNextText : '>>',
            btnPrevText: opt.btnPrevText != null ? opt.btnPrevText : '<<',
            dayDateTimeFormat: opt.dayDateTimeFormat != null ? opt.dayDateTimeFormat : { day: '2-digit', weekday: 'short' },
            monthDateTimeFormat: opt.monthDateTimeFormat != null ? opt.monthDateTimeFormat : { month: 'long' },
            headerDateTimeFormat: opt.headerDateTimeFormat != null ? opt.headerDateTimeFormat : { year: 'numeric' },
            onDayClick: opt.onDayClick != null ? opt.onDayClick : null,
            onYearChange: opt.onYearChange != null ? opt.onYearChange : null,
            onYearChanged: opt.onYearChanged != null ? opt.onYearChanged : null,
            renderEvents: opt.renderEvents != null ? renderEvents : this.renderEvents
        }

        console.debug('used options: ' + JSON.stringify(this.options));

        this.currentYear = this.options.start;
        this.render();
    }

    this.render = function() {
        console.debug('render called for year ' + this.currentYear);

        this.evaluateData();

        // remove all childElements inside of calendar div
        while (this.element.firstChild) {
            this.element.firstChild.remove()
        }

        this.element.classList.add('calendar');
        this.element.calendar = this;

        var preparedData = this.prepare(this.currentYear);

        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tr, th, td, span;


        if (this.options.header)
            thead.appendChild(this.renderHeader());

        var date = new Date(this.currentYear, 0, 1);

        // create month headers
        tr = document.createElement('tr');
        for (var i = 0; i < 12; i++) {
            th = document.createElement('th');
            th.innerText = innerText = new Intl.DateTimeFormat(this.options.lang, this.options.monthDateTimeFormat).format(new Date(this.currentYear, i, 1));
            th.colSpan = this.options.weeknumber ? 3 : 2;
            tr.appendChild(th);
        }
        thead.appendChild(tr);


        // render days
        for (var i = 0; i < preparedData.maxDays; i++) {
            tr = document.createElement('tr');
            for (var j = 0; j < 12; j++) {
                // render weekNumber column
                if (this.options.weeknumber) {
                    if (preparedData[j].length <= i) {
                        td = document.createElement('td');
                        tr.appendChild(td);
                    } else if (preparedData[j].length > i && preparedData[j][i].sameWeek != null) {
                        td = document.createElement('td');
                        td.classList.add('weeknumber-column');
                        td.rowSpan = preparedData[j][i].sameWeek;
                        td.innerText = preparedData[j][i].weeknumber;
                        tr.appendChild(td);
                    }
                }

                if (preparedData[j].length > i) {
                    td = document.createElement('td');
                    td.classList.add('day-column');
                    td.innerText = new Intl.DateTimeFormat(this.options.lang, this.options.dayDateTimeFormat).format(preparedData[j][i].date);
                    if (preparedData[j][i].date.isWeekend()) {
                        td.classList.add('day-weekend');
                    }
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.classList.add('event-column');
                    if (preparedData[j][i].date.getMonth() == j) {
                        if (preparedData[j][i].events != null && preparedData[j][i].events.length > 0) {
                            td.appendChild(this.options.renderEvents(preparedData[j][i].date, preparedData[j][i].events, this.options.onDayClick));
                        }
                        if (preparedData[j][i].date.isWeekend()) {
                            td.classList.add('day-weekend');
                        }
                    }
                    tr.appendChild(td);
                } else {
                    td = document.createElement('td');
                    td.colSpan = 2;
                    tr.appendChild(td);
                }
            }
            tbody.appendChild(tr);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        this.element.appendChild(table);

        console.debug('render complete for year ' + this.currentYear);
    }

    this.renderHeader = function() {
        console.debug('renderHeader called for year ' + this.currentYear);

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.colSpan = 4 * (this.options.weeknumber ? 3 : 2);
        tr.appendChild(td);

        td = document.createElement('td');
        td.classList.add('btn-column')
        td.colSpan = this.options.weeknumber ? 3 : 2;
        var btn = document.createElement('input');
        btn.classList.add('calendar-button', 'button-prev');
        btn.type = 'button';
        btn.value = this.options.btnPrevText;
        btn.style.float = 'right';
        btn.calendar = this;
        btn.addEventListener('click', function(event) {
            event.currentTarget.calendar.changeYear(event.currentTarget.calendar.currentYear - 1);
        });
        td.appendChild(btn);
        tr.appendChild(td);


        var th = document.createElement('th');
        th.colSpan = 2 * (this.options.weeknumber ? 3 : 2);
        th.classList.add('year-header');
        var span = document.createElement('span');
        span.innerText = new Intl.DateTimeFormat(this.options.lang, this.options.headerDateTimeFormat).format(new Date(this.currentYear, 0, 1));
        th.appendChild(span);
        tr.appendChild(th);

        td = document.createElement('td');
        td.classList.add('btn-column')
        td.colSpan = this.options.weeknumber ? 3 : 2;
        btn = document.createElement('input');
        btn.classList.add('calendar-button', 'button-next');
        btn.type = 'button';
        btn.value = this.options.btnNextText;
        btn.style.float = 'left';
        btn.calendar = this;
        btn.addEventListener('click', function(event) {
            event.currentTarget.calendar.changeYear(event.currentTarget.calendar.currentYear + 1);
        });
        td.appendChild(btn);
        tr.appendChild(td);

        td = document.createElement('td');
        td.colSpan = 4 * (this.options.weeknumber ? 3 : 2);
        tr.appendChild(td);

        return tr;
    }

    this.prepare = function(year) {
        console.debug('preparing calendar dates for year ' + year);

        var res = [];
        var date = new Date(year, 0, 1),
            weekDateTmp;
        var curMonth = 0,
            curWeek, sameWeekUntil;
        var maxLength = 0;
        var dayEvents;

        while (curMonth < 12) {
            date = new Date(year, curMonth, 1);
            res[curMonth] = [];

            while (date.getMonth() == curMonth) {
                dayEvents = null;
                if (this.data != null && this.data[date.getDateComponent()]) {
                    dayEvents = this.data[date.getDateComponent()];
                }

                if (date.getWeekNumber() != curWeek) {
                    curWeek = date.getWeekNumber();
                    sameWeekUntil = 0;
                    weekDateTmp = date;
                }

                while (weekDateTmp.getWeekNumber() == curWeek && weekDateTmp.getMonth() == curMonth) {
                    sameWeekUntil++;
                    weekDateTmp = weekDateTmp.addDays(1);
                }

                res[curMonth].push({ date: date, weekday: date.getDay(), weeknumber: date.getWeekNumber(), sameWeek: sameWeekUntil != null ? sameWeekUntil : null, events: dayEvents });
                date = date.addDays(1);

                sameWeekUntil = null;
            }

            if (res[curMonth].length > maxLength)
                maxLength = res[curMonth].length;

            curMonth++;
        }

        res.maxDays = maxLength;

        return res;
    }

    this.evaluateData = function() {
        console.debug('evaluating data');

        var evaluated = null;
        if (this.options.data instanceof Function) {
            evaluated = this.options.data(this.currentYear);
        } else {
            evaluated = this.options.data;
        }

        this.data = [];
        if (evaluated != undefined && evaluated != null) {
            for (i = 0; i < evaluated.length; i++) {
                if (this.data[new Date(evaluated[i].date).getDateComponent()] == null)
                    this.data[new Date(evaluated[i].date).getDateComponent()] = [];
                this.data[new Date(evaluated[i].date).getDateComponent()].push(evaluated[i]);
            }
        }

        console.debug('data evaluated');
    }

    this.renderEvents = function(date, events, onClick) {
        var span = document.createElement('span');
        span.classList.add('event-span');
        span.innerText = events.length;
        span.title = JSON.stringify(events);
        span.date = date;
        span.events = events;
        span.addEventListener('click', onClick);
        return span;
    }

    this.changeYear = function(year) {
        console.debug('changing year to ' + year);

        var previousYear = this.currentYear;
        var con = true;
        if (this.options.onYearChange != null) {
            con = this.options.onYearChange(this, previousYear, year);
        }

        if (con != undefined && !con)
            return;

        this.currentYear = year;

        this.render();

        if (this.options.onYearChanged != null) {
            this.options.onYearChanged(this, previousYear, year);
        }

        console.debug('changed year to ' + year);
    }

    this.init(opt);
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.getTime());
    date = date.setDate(date.getDate() + days);
    return new Date(date);
}

Date.prototype.getDateComponent = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}

Date.prototype.isWeekend = function() {
    return this.getDay() == 0 || this.getDay() == 6;
}

Date.prototype.getWeekNumber = function() {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};