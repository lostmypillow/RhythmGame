var setupKeys = function () {
  document.addEventListener('keydown', function (event) {
    var keyIndex = getKeyIndex(event.key);
    var flipper = document.querySelectorAll('.flipper');
    if (Object.keys(isHolding).indexOf(event.key) !== -1
      && !isHolding[event.key]) {
      isHolding[event.key] = true;
      keypress[keyIndex].style.display = 'block';

      if (isPlaying && tracks[keyIndex].firstChild) {
        judge(keyIndex);
      } //isplay &&
     flipper.forEach(function(i) {
        var rotate = 0;
        if (keyIndex === 0) {
          document.getElementById('bleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>'
          rotate += 180;
          flipper.style.transform = "rotateY(" + rotate + "deg)";
          document.getElementById('fleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>';


        }
        else if (keyIndex === 1) {
          document.getElementById('bleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>'
          rotate += 180;
          flipper.style.transform = "rotateY(" + rotate + "deg)";
          document.getElementById('fleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>';


        }
        if (keyIndex === 2) {
          document.getElementById('bleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>'
          rotate += 180;
          flipper.style.transform = "rotateY(" + rotate + "deg)";
          document.getElementById('fleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>';


        }
        if (keyIndex === 3) {
          document.getElementById('bleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>'
          rotate += 180;
          flipper.style.transform = "rotateY(" + rotate + "deg)";
          document.getElementById('fleft').innerHTML = "";
          document.getElementById('bleft').innerHTML += '<img src = "media/bottom.png"/>';


        }
      });

    } //is holding event key
  } //function (event) {}
); //addeventlistener

  document.addEventListener('keyup', function (event) {
    if (Object.keys(isHolding).indexOf(event.key) !== -1) {
      var keyIndex = getKeyIndex(event.key);
      isHolding[event.key] = false;
      keypress[keyIndex].style.display = 'none';
    } // !== -1)
  } //function(event)
); //before keyup
};// setupkeys main curly
