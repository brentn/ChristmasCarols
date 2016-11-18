(function(){
  "use strict";

  var fontSize;
  var nightMode;
  var songs;

  function init() {
    setBackgroundColour();
    fontSize=load("fontSize", 1);
    nightMode=load("nightMode", false);
    setFontSize();
    setNightMode();
    fetchJSONFile("./songs.json", function(response) {
      songs = response.songs.sort(function(a, b) {
        var x=a.title.toLowerCase();
        var y=b.title.toLowerCase();
        return x<y?-1:x>y?1:0;
      });
      showSong(0);
      populateMenu();
      openMenu();
    });
    setupClickListeners();
  }

  function setBackgroundColour() {
    if (Math.random() < 0.5) { document.body.className+="alt"; }
  }
  function populateMenu() {
    var songlist = document.getElementById("songlist");
    songlist.innerHTML="";
    for (var i = 0; i < songs.length; i++) {
      var song = songs[i];
      var menuItem=document.createElement("li");
      menuItem.appendChild(document.createTextNode(song.title.substr(0,25)));
      menuItem.id=i;
      menuItem.addEventListener("click", showSong);
      songlist.appendChild(menuItem);
    };
  }
  function setupClickListeners() {
    document.getElementById("menu-button").addEventListener("click", toggleMenu);
    document.getElementById("nightmode").addEventListener("click", toggleNight);
    document.getElementById("larger").addEventListener("click", increaseFont);
    document.getElementById("smaller").addEventListener("click", decreaseFont);
  }
  function load(key, defaultValue) {
    if (localStorage) {
      if (localStorage[key]) {return localStorage[key];}
    }
    return defaultValue;
  }
  function save(key, value) {
    if (localStorage) {
      localStorage[key] = value;
    }
  }
  function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) { callback(data); }
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
  }
  function openMenu() {
    var menu = document.getElementById('menu');
    if (! menu.classList.contains('open')) {
      menu.classList += ' open';
    }
    document.getElementById('log').innerHTML=menu.classList.length;
  }
  function closeMenu() {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
    }
  }
  function setNightMode() {
    var el = document.getElementById('song');
    document.getElementById('nightmode').checked = nightMode;
    if (nightMode) {
      el.classList += 'night'
    } else {
      el.classList.remove('night');
    }
  }
  function setFontSize() {
    var lyrics = document.getElementById('lyrics');
    lyrics.style.fontSize=fontSize+"em";
  }

  var showSong = function(evt) {
    var id = (evt && evt.target)?evt.target.id:0;
    var song = songs[id];
    var lyrics = song.lyrics.split('<verse>').join('<verse><p>')
                      .split('</verse>').join('</p></verse>')
                      .split('<chorus>').join("<chorus><p><span class='hint'>Chorus:</span><br/>")
                      .split('</chorus>').join('</p></chorus>')
                      .split('\n').join('<br/>');
    document.getElementById('title').innerHTML = song.title;
    document.getElementById('lyrics').innerHTML = lyrics;
    document.getElementById('author').innerHTML = song.author;
    closeMenu();
  }
  var toggleMenu = function() {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  var toggleNight = function() {
    nightMode = !nightMode;
    if (localStorage) {
      localStorage.setItem('nightMode', nightMode);
    }
    setNightMode();
    closeMenu();
  }
  var increaseFont = function() {
    fontSize += .2;
    if (localStorage) {
      localStorage.setItem('fontSize', fontSize);
    }
    setFontSize();
    closeMenu();
  }
  var decreaseFont = function() {
    fontSize -= .2;
    if (localStorage) {
      localStorage.setItem('fontSize', fontSize);
    }
    setFontSize();
    closeMenu();
  }

  init();
})();