# Year Calendar

## Usage

```html
<!DOCTYPE html>
<html>

<head>
    <title>Year Calendar</title>
    <link href="calendar.css" rel="stylesheet" />
    <script src="calendar.js"></script>
    <script>
        function init() {
            var calendar = new Calendar(document.getElementById('calendar'), { });
        }
    </script>
</head>

<body onload="init();">
    <div id="calendar"></div>
</body>
</html>
```

## Options

|Option|Description|Default|Notes|
|-|-|-|-|
|start|Start year|`new Date().getFullYear()`||
|data|Calendar data|null|Either data object or function returning data. If data is a function the current Year will be passed as argument. [Data fetching](#data-fetching)|
|lang|Language|`en`||
|header|Draw header and buttons|`true`||
|weeknumber|Render column for weeknumbers|`true`||
|btnNextText||`>>`||
|btnPrevText||`<<`||
|dayDateTimeFormat|Formatting for day dates|`{ day: '2-digit', weekday: 'short' }`|[Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects)|
|monthDateTimeFormat|Formatting for month dates|`{ month: 'long' }`|[Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects)|
|headerDateTimeFormat|Formatting for Year dates|`{ year: 'numeric' }`|[Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects)|
|onDayClick|Day clicked event|`null`|Events can be read from `event.currentTarget.events`. Date can be read from `event.currentTarget.date`.|
|onYearChange|Before year changed event|`null`|Can return `false` to prevent changing of year|
|onYearChanged|After year changed event|`null`||
|renderEvents|Function to render events for a single day|[Default event rendering](#default-event-rendering)|Function must return a DOM element|

### Data fetching

```javascript
data: function(year) {
    console.log('evaluating data for year ' + year);
    return [{
        date: "2022-01-01T00:00:00.000Z",
        title: "Event 1 Title"
    }, {
        date: "2022-01-01T00:00:00.000Z",
        title: "Event 2 Title"
    }, {
        date: "2022-01-02T00:00:00.000Z",
        title: "Event 3 Title"
    }, {
        date: "2022-01-03T00:00:00.000Z",
        title: "Event 4 Title"
    }, {
        date: "2022-01-05T00:00:00.000Z",
        title: "Event 5 Title"
    }, {
        date: "2022-01-06T00:00:00.000Z",
        title: "Event 6 Title"
    }, {
        date: "2022-01-07T00:00:00.000Z",
        title: "Event 7 Title"
    }, {
        date: "2022-01-08T00:00:00.000Z",
        title: "Event 8 Title"
    }, {
        date: "2022-01-09T00:00:00.000Z",
        title: "Event 9 Title"
    }];
}
```

### Default event rendering

```javascript
function(date, events, onClick) {
    var span = document.createElement('span');
    span.innerText = events.length;
    span.title = JSON.stringify(events);
    span.date = date;
    span.events = events;
    span.addEventListener('click', onClick);
    return span;
}
```

## Data

```javascript
[
    {
        date: "2022-01-01T00:00:00.000Z",
        title: "Event Title"
    },
    {
        date: "2022-01-02T00:00:00.000Z",
        title: "Event 2 Title"
    }
]
```