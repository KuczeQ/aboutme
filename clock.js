

var Clock = (function () {
	function pad(value) {
	  return ('0' + value).slice(-2);
	}

	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);  

    if (isMobile) {
        return;
    }

	function update(slot, value) {
	  var now = slot.dataset.now;
  
	  if (!now) {
		slot.dataset.now = value;
		slot.dataset.old = value;
		return;
	  }
  
	  if (now !== value) {
		flip(slot, value);
	  }
	}
  
	function flip(slot, value) {
	  slot.classList.remove('flip');
	  slot.dataset.old = slot.dataset.now;
	  slot.dataset.now = value;
	  slot.offsetLeft; 
	  slot.classList.add('flip');
	}
  
	function tick() {
	  var time = new Date();
	  var timeString = pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds());
  
	  for (var i = 0, l = this._slots.length; i < l; i++) {
		update(this._slots[i], timeString.charAt(i));
	  }
  
	  setTimeout(this._tick.bind(this), 1000);
	}
  
	function Clock(element) {
	  this._element = element;
	  this._element.innerHTML = Array(6).fill('<span>&nbsp;</span>').join('');
	  this._slots = this._element.getElementsByTagName('span');
	  this._tick();
	}
  
	Clock.prototype = {
	  _tick: tick,
	  _pad: pad,
	};
  
	return Clock;
  })();
  
  document.querySelectorAll('.clock').forEach(function (clockElement) {
	new Clock(clockElement);
  });
  