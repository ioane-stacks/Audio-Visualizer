window.onload = () => {
	const winWidth = window.innerWidth;
	const winHeight = window.innerHeight;
	const playpause = document.getElementById('pp');
	const audio = document.getElementById('aud');
	const vCircle = document.querySelector('.vCircle');
	const svgLine = document.getElementById('sv');
	const timeAudio = document.getElementById('tim');

	function changeColor(r, g, b) {
		let _r = r;
		let _g = g;
		let _b = b;

		return `rgba(${_r}, ${_g}, ${_b}`;
	}

	document.body.style.backgroundColor = changeColor(0, 20, 50);

	window.onmousemove = (e) => {
		let g = Math.round((20 / 1366) * e.pageX) + 10;
		let b = Math.round((20 / 1366) * e.pageX) + 35;
		document.body.style.backgroundColor = changeColor(0, g, b);
	};

	playpause.onclick = () => {
		if (playpause.innerHTML === '⏵') {
			playpause.innerHTML = '❚❚';
			playpause.style.fontSize = '46px';
			audio.play();
			isAnalyserEnabled = true;
		} else {
			playpause.innerHTML = '⏵';
			playpause.style.fontSize = '62px';
			audio.pause();
			isAnalyserEnabled = false;
		}
		audioContext.resume();
	};
	const audioContext = new AudioContext();
	audioContext.resume();

	const source = audioContext.createMediaElementSource(audio);
	const analyser = audioContext.createAnalyser();

	source.connect(analyser);
	analyser.connect(audioContext.destination);
	analyser.fftSize = 1024;

	const bufferLegth = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLegth);

	let x = 0;
	let c = 0;
	let arr = [];
	let isAnalyserEnabled = false;
	let isNodeAdded = false;
	function DeployDataArray() {
		if (isAnalyserEnabled) {
			arr = [];
			let temp = [];
			let points = '';
			analyser.getByteFrequencyData(dataArray);

			for (i = 0; i < bufferLegth; i += 0.7) {
				if (dataArray[i] !== undefined) x = dataArray[i];
				// x = x > 254 ? x - 150 : x;
				vCircle.style.width = `${x / 1.1 + 350}px`;
				vCircle.style.height = `${x / 1.1 + 350}px`;
				vCircle.style.boxShadow = `0 0 ${x > 170 ? x / 3 : 10}px rgba(64, 116, 165, .6),
            inset 0 0 ${x > 180 ? x / 4 : 10}px ${x > 170 ? x / 5 : 10}px rgb(${x / 2}, 6, 102, .4)`;
			}
			for (i = 0; i < bufferLegth; i += 0.7) {
				if (dataArray[i] !== undefined) c = dataArray[i];
				temp.push(c);
			}
			arr.push(...new Set(dataArray));
			let arr2 = [...arr];
			for (i = 0; i < arr2.length; i++) {
				points +=
					i !== arr2.length - 1
						? `${arr2[i] * Math.random() * 10 - 175},${arr2[i] * Math.random() * 10 - 175} `
						: `${arr2[i] * Math.random() * 10 + 175},${arr2[i] * Math.random() * 10 + 175}`;
				svgLine.style.stroke = `rgb(0, ${arr2[i] > 100 && arr2[i] * 1.7}, ${arr2[i] > 100 && arr2[i] * 1.7})`;
				document.body.style.backgroundSize = `calc(150% + ${x * Math.atan((x * Math.PI) / 180)}px)`;
			}

			// console.log([...new Set(temp)]);
			let arr3 = [...new Set(temp)];
			for (i = 0; i < [...new Set(temp)].length; i++) {
				if (!isNodeAdded) {
					if (arr3[i] > 242) {
						const drop = document.createElement('p');
						const choose = Math.trunc(Math.random() * 4);
						drop.classList.add('dots');
						drop.id = 'drp' + Math.trunc(Math.random() * 10000);
						document.body.insertAdjacentElement('beforebegin', drop);
						isNodeAdded = true;
						new dropEffector(drop.id, 350);
					}
				}
			}
			timeAudio.innerHTML = getTime(audio.currentTime);
			svgLine.setAttribute('points', points);
		}
		requestAnimationFrame(DeployDataArray);
	}
	DeployDataArray();

	// class circleEffector {
	// 	constructor(dropId, startPx) {
	// 		this.opc = 1;
	// 		this.glwidth = startPx;
	// 		this.dropId = dropId;
	// 		this.posx = 0;
	// 		this.randInt = (Math.random() - 0.5) * 2;
	// 		this.animator = setInterval(() => {
	// 			this.randInt > 0 ? this.posx++ : this.posx--;
	// 			this.tmp = document.getElementById(this.dropId);
	// 			this.glwidth += 5;
	// 			this.opc -= 0.01;
	// 			// console.log(this.opc);
	// 			this.tmp.style.width = this.glwidth + 'px';
	// 			this.tmp.style.height = this.glwidth + 'px';
	// 			this.tmp.style.left = `calc(50% + ${this.posx}px)`;
	// 			this.tmp.style.opacity = this.opc;
	// 			if (this.opc < 0.6) {
	// 				isNodeAdded = false;
	// 			}
	// 			if (this.opc <= 0) {
	// 				this.tmp.remove();
	// 				clearInterval(this.animator);
	// 				isNodeAdded = false;
	// 			}
	// 		}, 1000 / 25);
	// 	}
	// }

	class dropEffector {
		constructor(dropId, startPx) {
			this.opc = 1;
			this.glwidth = Math.trunc(Math.random() * 7 - 2) + 2;
			this.dropId = dropId;
			this.posx = 0;
			this.posy = 0;
			this.randCoeX = Math.trunc((Math.random() - 0.5) * 50);
			this.randCoeY = Math.trunc((Math.random() - 0.5) * 50);
			this.tmp = document.getElementById(this.dropId);
			this.animator = setInterval(() => {
				// console.log(this.randInt);
				this.posx += this.randCoeX;
				this.posy += this.randCoeY;
				this.glwidth += 1.2;
				this.opc -= 0.05;
				// console.log(this.opc);
				this.tmp.style.width = this.glwidth + 'px';
				this.tmp.style.height = this.glwidth + 'px';
				this.tmp.style.fontSize = this.glwidth + 'px';
				this.tmp.style.left = `calc(50% + ${this.posx}px)`;
				this.tmp.style.top = `calc(50% + ${this.posy}px)`;
				this.tmp.style.opacity = this.opc;
				if (this.opc < 0.6) {
					isNodeAdded = false;
				}
				if (this.opc <= 0) {
					this.tmp.remove();
					clearInterval(this.animator);
					isNodeAdded = false;
				}
			}, 1000 / 25);
		}
	}

	function getTime(audioTime) {
		let min = Math.floor(audioTime / 60);
		let sec = (audioTime - min * 60).toFixed(1);
		let milisec = String(sec).slice(String(sec).indexOf('.') + 1);
		sec = String(sec).substring(0, String(sec).indexOf('.'));

		return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
	}
};
