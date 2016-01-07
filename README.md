# Solstice

Solstice is a vanilla Javascript date picker that requires minimal set up.

## Installation

`npm install solstice`

## Usage
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
