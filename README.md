# Solstice

[![Build Status](https://travis-ci.org/JasonVeselka/solstice.svg?branch=master)](https://travis-ci.org/JasonVeselka/solstice)

Solstice is a vanilla Javascript date picker that requires minimal set up.

## Installation

`npm install solstice`

## Other Commands
- ```build``` Builds css and javascript for the project.
- ```watch ``` Builds and watches the project for development.
- ```lint``` Runs eslint on the src files.
- ```clean``` Cleans up the reports.
- ```test ``` Runs tests in live watch mode for development.

## Usage
If you're not using node for your project you'll need to make sure that you've built out the dist directory. Then you should be able to access solstice by including a script tag.

```
<script type="text/javascript" src="{path_to_directory}/solstice.js"></script>
```

Solstice attaches itself to the window object when included in the script tag. Now you should be able to access it's functionality by just specifying a container element to Solstice's constructor. At this point you may want to also add css around either the built in classes for Solstice or you can specify your own classes in the options object.

```
var containerEl = document.getElementById('container-el');
// Could be window.Solstice
var solsticeObject = new Solstice(containerEl);
```

If you're using node you can just include it in your project.

```
var Solstice = require('solstice');
```

Full example (found in examples/example.html):

```html
<!DOCTYPE>
<html>
  <head>
    <script type="text/javascript" src="../dist/solstice.js"></script>
    <link rel="stylesheet" href="../dist/solstice.css" />
  </head>
  <body>
    <div>
      <div id="container-el"></div>
      <button id="okay">Ok</button>
    </div>
    <div>
      Date Selected:
      <span id="aSpanOfDate"></span>
    </div>
    <script type="text/javascript">
      if(Solstice){
        var containerEl = document.getElementById('container-el'),
          okayBtn = document.getElementById('okay'),
          theSpan = document.getElementById('aSpanOfDate'),
          sols = new Solstice(containerEl);
        okayBtn.onclick = function(){
          theSpan.innerText = sols.getDate();
        };
      }
    </script>
  </body>
</html>
```

## Options

There are options you can set
  - date: The default date that is shown in the calendar. This is optional and will default to today's date and time.
  - showYearCtrls: This boolean is to show whether or not the the year controls. Optional and defaults to false.
  - timeSeparator: This is the separation between Hours/Minutes/Seconds and is by default a colon ":".

  ```
    var exampleSolstice = Solstice('containerEl', { date: 'January 1, 2015 12:00:00 AM PST', showYearCtrls: true, timeSeparator: '.'});
  ```
