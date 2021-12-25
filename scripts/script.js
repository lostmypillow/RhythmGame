var isHolding = {
  s: false,
  f: false,
  j: false,
  l: false
};

var hits = {
  perfect: 0,
  good: 0,
  bad: 0,
  miss: 0
};
var multiplier = {
  perfect: 1,
  good: 0.8,
  bad: 0.5,
  miss: 0,
  combo40: 1.05,
  combo80: 1.10
};
var isPlaying = false;
var speed = 0;
var combo = 0;
var maxCombo = 0;
var score = 0;
var animation = 'moveDown';
var startTime;
var trackContainer;
var tracks;
var keypress;
var comboText;

var initializeNotes = function() {
  var noteElement;
  var trackElement;

  while (trackContainer.hasChildNodes()) {
    trackContainer.removeChild(trackContainer.lastChild);
  }

  song.sheet.forEach(function(key, index, i) {
    trackElement = document.createElement('div');
    trackElement.classList.add('track');

    key.notes.forEach(function(note) {
      var img = document.createElement('img');
      img.src = "img/arrow.svg";
      img.height = "100%";
      img.width ="100%";
      noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.classList.add('note--' + index);
    //  noteElement.classlist.add('alignright');//
    //  noteElement.style.backgroundColor = key.color;//
    noteElement.appendChild(img);
      noteElement.style.animationName = animation;
      noteElement.style.animationTimingFunction = 'linear';
      noteElement.style.animationDuration = note.duration - speed + 's';
      noteElement.style.animationDelay = note.delay + speed + 's';
      noteElement.style.animationPlayState = 'paused';
      trackElement.appendChild(noteElement);
    });

    trackContainer.appendChild(trackElement);
    tracks = document.querySelectorAll('.track');
  });
};

var setupSpeed = function() {
  var buttons = document.querySelectorAll('.btn--small');

  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      if (this.innerHTML === '1x') {
        buttons[0].className = 'btn btn--small btn--selected';
        buttons[1].className = 'btn btn--small';
        buttons[2].className = 'btn btn--small';
        speed = parseInt(this.innerHTML) - 1;
      } else if (this.innerHTML === '2x') {
        buttons[0].className = 'btn btn--small';
        buttons[1].className = 'btn btn--small btn--selected';
        buttons[2].className = 'btn btn--small';
        speed = parseInt(this.innerHTML) - 1;
      } else if (this.innerHTML === '3x') {
        buttons[0].className = 'btn btn--small';
        buttons[1].className = 'btn btn--small';
        buttons[2].className = 'btn btn--small btn--selected';
        speed = parseInt(this.innerHTML) - 1;
      }

      initializeNotes();
    });
  });
};

//var setupChallenge = function () {
//  var enabled = false;
//  var challenge = document.querySelector('.config__challenge');
//  challenge.addEventListener('click', function (event) {
//    if (enabled) {
//      event.target.className = 'btn btn--small';
//      enabled = false;
//    } else {
//      event.target.className = 'btn btn--small btn--selected';
//      enabled = true;
//      updateAnimation();
//    }
//  });
//};

//var updateAnimation = function () {
//  animation = 'moveDownFade';
//  initializeNotes();
//};
var setuphomebutton = function() {
  var homebutton = document.querySelector('.homebutton');
  homebutton.addEventListener('click', function() {
    document.querySelector('.homewrapper').style.opacity = 0;
//    document.querySelector('.homewrapper').style.setProperty = 0;//
    document.querySelector('#parent').style.opacity = 1;
  });
};



var setupStartButton = function() {
  var startButton = document.querySelector('.btn--start');
  startButton.addEventListener('click', function() {
    isPlaying = true;
    startTime = Date.now();

    startTimer(song.duration);
    document.querySelector('.menu').style.opacity = 0;
  //  document.querySelector('.left_sec').style.opacity = 1;
  //  document.querySelector('.left_sec').style.opacity = 1;
  document.querySelectorAll('.flipper').forEach(function (ha) {
    ha.style.opacity = 1;
  });
    document.querySelector('.song').play();
    document.querySelectorAll('.note').forEach(function(note) {
      note.style.animationPlayState = 'running';
    });
  });
};

var startTimer = function(duration) {
  var display = document.querySelector('.summary__timer');
  var timer = duration;
  var minutes;
  var seconds;

  display.style.display = 'block';
  display.style.opacity = 1;

  var songDurationInterval = setInterval(function() {
    minutes = Math.floor(timer / 60);
    seconds = timer % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    display.innerHTML = minutes + ':' + seconds;

    if (--timer < 0) {
      clearInterval(songDurationInterval);
      showResult();
      comboText.style.transition = 'all 1s';
      comboText.style.opacity = 0;
    }
  }, 1000);
};

var showResult = function() {
  document.querySelector('.perfect__count').innerHTML = hits.perfect;
  document.querySelector('.good__count').innerHTML = hits.good;
  document.querySelector('.bad__count').innerHTML = hits.bad;
  document.querySelector('.miss__count').innerHTML = hits.miss;
  document.querySelector('.combo__count').innerHTML = maxCombo;
  document.querySelector('.score__count').innerHTML = score;
  document.querySelector('.summary__timer').style.opacity = 0;
  document.querySelector('.summary__result').style.opacity = 1;
  document.querySelectorAll('.flip-container').forEach(function (i) {
    i.style.opacity = 0;
});
};

var setupNoteMiss = function() {
  trackContainer.addEventListener('animationend', function(event) {
    var index = event.target.classList.item(1)[6];

    displayAccuracy('miss');
    updateHits('miss');
    updateCombo('miss');
    updateMaxCombo();
    removeNoteFromTrack(event.target.parentNode, event.target);
    updateNext(index);
  });
};

/**
 * Allows keys to be only pressed one time. Prevents keydown event
 * from being handled multiple times while held down.
 */
var setupKeys = function() {
  document.addEventListener('keydown', function(event) {
    var keyIndex = getKeyIndex(event.key);
      var flipper = document.querySelectorAll('.flipper');
    if (Object.keys(isHolding).indexOf(event.key) !== -1 &&
      !isHolding[event.key]) {
      isHolding[event.key] = true;
      keypress[keyIndex].style.display = 'block';

      if (isPlaying && tracks[keyIndex].firstChild) {
        judge(keyIndex);
      }
      flipper.forEach(function(i) {
        var new_state = 0;
        var prev_state = 0;
  //      var hello = document.getElementById('flop');
    //    var transform = 'rotateY('+ prev_state + 'deg)';
      //  var styles = window.getComputedStyle(document.getElementById('flop'), "").getPropertyValue('transform');
    //    if (keyIndex === 0) {

      //    document.getElementById('bleft').innerHTML = "";
      //    document.getElementById('bleft').innerHTML += '<img src = "img/bottom.png"/>';
      //    new_state += 180;
      //    document.getElementById('flop').styles.transform = "rotateY(180deg)";
        //  prev_state = new_state;
          //rotate += 180;
        //  flipper.style.transform = "rotateY(" + rotate + "deg)";
      //    document.getElementById('fleft').innerHTML = "";
      //    document.getElementById('fleft').innerHTML += '<img src = "img/bottom.png"/>';


  //      } else if (keyIndex === 1) {
  //        document.getElementById('bleft').innerHTML = "";
  //        document.getElementById('bleft').innerHTML += '<img src = "img/left.png"/>';
          //rotate += 180;
          //flipper.style.transform = "rotateY(" + rotate + "deg)";
      //    document.getElementById('fleft').innerHTML = "";
    //      document.getElementById('bleft').innerHTML += '<img src = "img/left.png"/>';


    //    }
    //    else if (keyIndex === 2) {
    //      document.getElementById('bleft').innerHTML = "";
    //      document.getElementById('bleft').innerHTML += '<img src = "img/top.jpg"/>';
          //rotate += 180;
          //flipper.style.transform = "rotateY(" + rotate + "deg)";
    //      document.getElementById('fleft').innerHTML = "";
    //      document.getElementById('bleft').innerHTML += '<img src = "img/top.jpg"/>';


    //    }
    //    else if (keyIndex === 3) {
    //      document.getElementById('bleft').innerHTML = "";
    //      document.getElementById('bleft').innerHTML += '<img src = "img/right.jpg"/>';
          //rotate += 180;
          //flipper.style.transform = "rotateY(" + rotate + "deg)";
    //      document.getElementById('fleft').innerHTML = "";
    //      document.getElementById('bleft').innerHTML += '<img src = "img/right.jpg"/>';


    //    }
      });

    }
  });

  document.addEventListener('keyup', function(event) {
    if (Object.keys(isHolding).indexOf(event.key) !== -1) {
      var keyIndex = getKeyIndex(event.key);
      isHolding[event.key] = false;
      keypress[keyIndex].style.display = 'none';
    }
  });
};

var getKeyIndex = function(key) {
  if (key === 's') {
    return 0;
  } else if (key === 'f') {
    return 1;
  } else if (key === 'j') {
    return 2;
  } else if (key === 'l') {
    return 3;
  }
};




var judge = function(index) {
  var timeInSecond = (Date.now() - startTime) / 1000;
  var nextNoteIndex = song.sheet[index].next;
  var nextNote = song.sheet[index].notes[nextNoteIndex];
  var perfectTime = nextNote.duration + nextNote.delay;
  var accuracy = Math.abs(timeInSecond - perfectTime);
  var hitJudgement;

  /**
   * As long as the note has travelled less than 3/4 of the height of
   * the track, any key press on this track will be ignored.
   */
  if (accuracy > (nextNote.duration - speed) / 4) {
    return;
  }

  hitJudgement = getHitJudgement(accuracy);
  displayAccuracy(hitJudgement);
  showHitEffect(index);
  updateHits(hitJudgement);
  updateCombo(hitJudgement);
  updateMaxCombo();
  calculateScore(hitJudgement);
  removeNoteFromTrack(tracks[index], tracks[index].firstChild);
  updateNext(index);
};

var getHitJudgement = function(accuracy) {
  if (accuracy < 0.1) {
    return 'perfect';
  } else if (accuracy < 0.2) {
    return 'good';
  } else if (accuracy < 0.3) {
    return 'bad';
  } else {
    return 'miss';
  }
};

var displayAccuracy = function(accuracy) {
  var accuracyText = document.createElement('div');
  document.querySelector('.hit__accuracy').remove();
  accuracyText.classList.add('hit__accuracy');
  accuracyText.classList.add('hit__accuracy--' + accuracy);
  accuracyText.innerHTML = accuracy;
  document.querySelector('.hit').appendChild(accuracyText);
};

var showHitEffect = function(index) {
  var key = document.querySelectorAll('.key')[index];
  var hitEffect = document.createElement('div');
  hitEffect.classList.add('key__hit');
  key.appendChild(hitEffect);
};

var updateHits = function(judgement) {
  hits[judgement]++;
};

var updateCombo = function(judgement) {
  if (judgement === 'bad' || judgement === 'miss') {
    combo = 0;
    comboText.innerHTML = '';
  } else {
    comboText.innerHTML = ++combo;
  }
};

var updateMaxCombo = function() {
  maxCombo = maxCombo > combo ? maxCombo : combo;
};

var calculateScore = function(judgement) {
  if (combo >= 80) {
    score += 1000 * multiplier[judgement] * multiplier.combo80;
  } else if (combo >= 40) {
    score += 1000 * multiplier[judgement] * multiplier.combo40;
  } else {
    score += 1000 * multiplier[judgement];
  }
};

var removeNoteFromTrack = function(parent, child) {
  parent.removeChild(child);
};

var updateNext = function(index) {
  song.sheet[index].next++;
};

window.onload = function() {
  trackContainer = document.querySelector('.track-container');
  keypress = document.querySelectorAll('.keypress');
  comboText = document.querySelector('.hit__combo');
  setuphomebutton();
  initializeNotes();
  setupSpeed();
  setupStartButton();
  setupKeys();
  setupNoteMiss();
};
