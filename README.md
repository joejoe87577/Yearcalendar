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
            var calendar = new Calendar(document.getElementById('calendar'));
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
|data|Calendar data|null|Either data object or function returning data. If data is a function the current Year will be passed as argument|
|lang|Language|`en`||
|header|Draw header and buttons|`true`||
|dayDateTimeFormat|Formatting for day dates|`{ day: '2-digit', weekday: 'short' }`|[Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects)|
|monthDateTimeFormat|Formatting for month dates|`{ month: 'long' }`|[Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects)|
|headerDateTimeFormat|Formatting for Year dates|`{ year: 'numeric' }`|[Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects)|
|onDayClick|Day clicked event|`null`||
|onYearChange|Before year changed event|`null`||
|onYearChanged|After year changed event|`null`||

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