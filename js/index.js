

function isMobile(){
	var UserAgent = navigator.userAgent;
	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null)
	{
		return true;
	}else{
		return false;
	}
}

let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// 리사이즈
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
})

const pitch = ['-', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D2', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', '-']

const freqArray = tf.tensor1d([parseInt(98 / 5.55), parseInt(104 / 5.55), parseInt(110 / 5.55), parseInt(117 / 5.55), parseInt(123 / 5.55), parseInt(131 / 5.55), parseInt(139 / 5.55), parseInt(147 / 5.55), parseInt(156 / 5.55), parseInt(165 / 5.55), parseInt(175 / 5.55), parseInt(185 / 5.55), parseInt(196 / 5.55), parseInt(208 / 5.55), parseInt(220 / 5.55), parseInt(233 / 5.55), parseInt(247 / 5.55), parseInt(262 / 5.55), parseInt(277 / 5.55), parseInt(294 / 5.55), parseInt(311 / 5.55), parseInt(330 / 5.55), parseInt(349 / 5.55), parseInt(370 / 5.55), parseInt(392 / 5.55), parseInt(415 / 5.55), parseInt(440 / 5.55), 0], 'int32')

var freqOneHot = tf.oneHot(freqArray, 1000)

for (i = 1; i < 30; i++){
    freqOneHot = tf.add(freqOneHot, tf.oneHot(tf.mul(freqArray, tf.scalar(i+2, 'int32')), 1000, onValue=0.8))
    freqOneHot = tf.add(freqOneHot, tf.oneHot(tf.tensor1d([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 600+10*i], 'int32'), 1000))
}

freqOneHot = tf.clipByValue(freqOneHot, 0, 1)

const num = {'' : [0, 0, 0], ' ' : [0, 0, 0], 'a': [1, 0.7, 0.7], 'e': [1, 1, 0.7], 'i': [0.7, 1, 0.7], 'o': [0.7, 1, 1], 'u': [0.7, 0.7, 1],
    'w': [0.7, 0.7, 1], 'y':[0.7, 1, 0.7], 'h': [0.7, 0.7, 0.7], 'f': [0.7, 0.7, 0.7],
    'r': [1, 0.4, 0.4], 'n': [0.4, 1, 0.4], 'N': [0.5, 1, 0.5], 'm': [0.4, 0.4, 1],
    'g': [0.4, 0, 0], 'd': [0, 0.4, 0], 'b': [0, 0, 0.4],
    'k': [0.2, 0, 0], 't': [0, 0.2, 0], 'T': [0, 0.1, 0], 'p': [0, 0, 0.2],
    's': [0.7, 0.4, 0.4], 'sh': [0.7, 0.4, 0.4], 'ch': [0.4, 0.7, 0.4], 'ts': [0.4, 0.7, 0.4], 'z': [0.4, 0.4, 0.7], 'j': [0.4, 0.4, 0.7]}

function parseMd(md){

    var md0 = md;
  
    //ul
    md = md.replace(/^\s*\n\*\s/gm, '<ul>\n* ');
    md = md.replace(/^(\*\s.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\*\s(.+)/gm, '<li class="before">$1</li>');
    
    //ul
    md = md.replace(/^\s*\n\-\s/gm, '<ul>\n* ');
    md = md.replace(/^(\-\s.+)\s*\n([^\-])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\-\s(.+)/gm, '<li class="before">$1</li>');
    
    //ol
    md = md.replace(/^\s*\n\d\.\s/gm, '<ol>\n1. ');
    md = md.replace(/^(\d\.\s.+)\s*\n([^\d\.])/gm, '$1\n</ol>\n\n$2');
    md = md.replace(/^\d\.\s(.+)/gm, '<li>$1</li>');
    
    //blockquote
    md = md.replace(/^\>(.+)/gm, '<blockquote>$1</blockquote>');
    md = md.replace('</blockquote><blockquote>', '');
    md = md.replace('</blockquote>\n<blockquote>', '\n');

    //hr
    md = md.replace(/[\-]{3}/g, '</div></div><div class="item_wrap"><div class="line">✿</div><div class="item">');
    
    //h
    md = md.replace(/\n[\#]{6}(.+)/g, '<h6>$1</h6>');
    md = md.replace(/\n[\#]{5}(.+)/g, '<h5>$1</h5>');
    md = md.replace(/\n[\#]{4}(.+)/g, '<h4>$1</h4>');
    md = md.replace(/\n[\#]{3}(.+)/g, '<h3>$1</h3>');
    md = md.replace(/\n[\#]{2}(.+)/g, '<h2>$1</h2>');
    md = md.replace(/\n[\#]{1}(.+)/g, '</div></div><div class="item_wrap"><div class="line">✿</div><div class="item"><h1>🎼 $1</h1>');
    
    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<div class="gallery"><a href="$3"><img src="$2" alt="$1" width="100%" /></a></div>');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" width="100%" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    
    //font styles
    md = md.replace(/[\*]{2}([^\*]+)[\*]{2}/g, '<strong>$1</strong>');
    md = md.replace(/[\*]{1}([^\*]+)[\*]{1}/g, '<i>$1</i>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');


    //주석
    md = md.replace(/\n[\/]{2}(.+)/g, '');
    

    //pre
    
    var mdpos = [];
    var rawpos = [];
    let pos1 = -1;
    let k = 0;

    var diff = [0]

    while( (pos1 = md0.indexOf('\n```', pos1 + 1)) != -1 ) { 
        if (k % 2 == 0){
            rawpos[k] = pos1 + 4;
        } else {
            rawpos[k] = pos1;
        }
        k++;
    }

    let pos2 = -1;
    let l = 0;

    while( (pos2 = md.indexOf('\n```', pos2 + 1)) != -1 ) { 
        if (l % 2 == 0){
            mdpos[l] = pos2 - 1;
        } else {
            mdpos[l] = pos2 + 5;
        }
        l++;
    }


    for (var i = 0; i < mdpos.length; i++){
        if (i % 2 == 0){
            md = md.replace(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]), '<pre class="code">'+md0.substring(rawpos[i], rawpos[i+1])+'</pre>');

            var mdSubStringLength = mdpos[i+1] - mdpos[i];
            var rawSubStringLength = rawpos[i+1] - rawpos[i] + '<pre class="code">'.length + '</pre>'.length;
            diff[i+2] = diff[i] + mdSubStringLength - rawSubStringLength;

        }
    }

    //code
    md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');

    //br
    md = md.replace(/\n\n/g, '</p><p>');
    
    return md;
    
}

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject();
var page = qs.p;
var model = qs.m;
var bpm = qs.b;


if (!page && !model) {
    var url = "https://raw.githubusercontent.com/jyhyun1008/seodangcat/main/README.md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".page_title").innerText = 'MAIN'
        document.querySelector("#post").innerHTML += parseMd(out)
    })
    .catch(err => { throw err });
} else if (page) {
    if (page == 'dataset'){

        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.returnValue = '';
        });

        document.querySelector(".page_title").innerHTML = '<div class="filebox"><input class="mp3-name" value="첨부파일" placeholder="첨부파일"><label for="mp3File">WAVE</label> <input type="file" id="mp3File" accept=".wav"/></div><br><div class="filebox"><input class="midi-name" value="첨부파일" placeholder="첨부파일"><label for="midiFile">MIDI</label> <input type="file" id="midiFile" accept=".mid"/></div>';
        document.querySelector("#post").innerHTML += '<div id="modebar"><i class="bx bx-checkbox-checked selected" id="mode-select"></i></i><i class="bx bx-pencil" id="mode-add"></i> <input type="button" value="재생" id="playButton"/> <div><input type="button" value="저장" id="saveButton"/> <a id="saveLink"></a></div></div>';

        $("#file").on('change',function(){
            var fileName = $("#file").val();
            
          });

        document.querySelector("#piano-roll").innerHTML += '<audio id="sound" controls></audio><div id="noteGuideContainer"><canvas id="noteguide"></canvas></div>';
        document.querySelector("#piano-roll").innerHTML += '<div id ="editorContainer"><canvas id="editor"></canvas><canvas id="waveviewer"></canvas><div class="v-line"></div></div>';

        const playButton = document.querySelector("#playButton")
        const playControl = document.querySelector("#sound")

        var mode = 'select';

        document.querySelector("#mode-select").onclick = function(e){
            document.querySelector("#mode-select").classList.add('selected');
            document.querySelector("#mode-add").classList.remove('selected');
            mode = 'select';
        }

        document.querySelector("#mode-add").onclick = function(e){
            document.querySelector("#mode-select").classList.remove('selected');
            document.querySelector("#mode-add").classList.add('selected');
            mode = 'add';
        }

        var canvas = document.getElementById('waveviewer');
        var canvas0 = document.getElementById('noteguide');
        var canvas1 = document.getElementById('editor');
        resizeCanvasToDisplaySize(canvas); 
        resizeCanvasToDisplaySize(canvas0); 
        resizeCanvasToDisplaySize(canvas1); 

        var ctx=canvas.getContext("2d");
        var ctx0=canvas0.getContext("2d");
        var ctx1=canvas1.getContext("2d");
        //ctx.globalCompositeOperation = 'multiply';

        var w = canvas.width;    
        var h = canvas.height;

        var cellwidth = 10;
        var cellheight=h/29;

        var notes = [];
        var fileName;

        var noteIndex = -1
        var input

        var playAudio, playAnimation

        drawPitchGuide();
        drawPianoGrid();
        drawScore();

        const mp3Source = document.querySelector('#mp3File')

        mp3Source.addEventListener("change", (e) => {
            
            const files = e.target.files;
            if (files.length > 0) {
                const file = files[0];
                fileName = file.name.substring(0, file.name.lastIndexOf('.'))
                $(".mp3-name").val(fileName);

                var reader = new FileReader();
                reader.addEventListener('load', function(e) {
                    var url = e.target.result;
                    drawAudio(url);
                    playControl.src = URL.createObjectURL(file);
                    playAudio = new Audio(playControl.src);

                    playButton.addEventListener('click', function(event){
                        if (playButton.value == '재생') {
                            playButton.value = '정지';
                            playAudio.play();
                            (function repeatOften() {
                                vLinePosition += 10;
                                vLine.setAttribute('style', 'height: 609px; left: '+vLinePosition+'px;');
                                playAnimation = requestAnimationFrame(repeatOften);
                            })();
                        } else if (playButton.value == '정지') {
                            playButton.value = '재생';
                            playAudio.pause();
                            cancelAnimationFrame(playAnimation);
                        }
                    });

                    document.onkeydown = function(e){
                        var keyCode = e.keyCode;
                        if (keyCode === 32) {
                            if (playButton.value == '재생') {
                                playButton.value = '정지';
                                playAudio.play();
                                (function repeatOften() {
                                    vLinePosition += 10;
                                    vLine.setAttribute('style', 'height: 609px; left: '+vLinePosition+'px;');
                                    playAnimation = requestAnimationFrame(repeatOften);
                                })();
                            } else if (playButton.value == '정지') {
                                playButton.value = '재생';
                                playAudio.pause();
                                cancelAnimationFrame(playAnimation);
                            }
                        } else if (keyCode === 49) {
                            document.querySelector("#mode-select").classList.add('selected');
                            document.querySelector("#mode-add").classList.remove('selected');
                            mode = 'select';
                        } else if (keyCode === 50) {
                            document.querySelector("#mode-select").classList.remove('selected');
                            document.querySelector("#mode-add").classList.add('selected');
                            mode = 'add';
                        }
                    };


                });
                reader.readAsDataURL(file);

                // Set up audio context
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();

                /**
                 * Retrieves audio from an external source, the initializes the drawing function
                 * @param {String} url the url of the audio we'd like to fetch
                 */
                const drawAudio = (url) => {
                fetch(url)
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                    .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))));
                };

                /**
                 * Filters the AudioBuffer retrieved from an external source
                 * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
                 * @returns {Array} an array of floating point numbers
                 */
                const filterData = (audioBuffer) => {
                    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
                    const samples = 18000; // Number of samples we want to have in our final data set
                    const blockSize = (audioBuffer.sampleRate / 1200); // the number of samples in each subdivision
                    const filteredData = [];
                    for (let i = 0; i < parseInt(samples); i++) {
                        value = rawData[Math.floor(blockSize * i)]
                        filteredData.push(value); // divide the sum by the block size to get the average
                    }
                    return filteredData;
                };

                /**
                 * Normalizes the audio data to make a cleaner illustration 
                 * @param {Array} filteredData the data from filterData()
                 * @returns {Array} an normalized array of floating point numbers
                 */
                const normalizeData = filteredData => {
                    const multiplier = Math.pow(Math.max(...filteredData), -1);
                    var resultData = filteredData.map(n => n * multiplier)
                    console.log(filteredData)
                    return resultData;
                }

                const draw = (normalizedData) => {
                    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
                    drawPianoGrid();
                    const padding = 0;
                    var width = 0.5;
                    ctx.lineWidth = 1; // how thick the line is
                    ctx.strokeStyle = "#ffafcc"; // what color our line is
                    ctx.beginPath();
                    ctx.moveTo(0, h/2);
                    for (let i = 0; i < normalizedData.length; i++) {
                        const x = width * i;
                        let height = normalizedData[i] * canvas.offsetHeight - padding;
                        ctx.lineTo(x, height+h/2);
                    }
                    ctx.stroke();
                }

            }

        });

        canvas1.onmousedown = function(event){
            var BCR = canvas1.getBoundingClientRect();
            const x = parseInt((event.clientX - BCR.left)/cellwidth); 
            const y = parseInt((h - (event.clientY - BCR.top))/cellheight);
            if (mode == 'add'){
                addNote(x, y);
                drawScore();
            } else if (mode == 'select'){

                var vlinechange = true

                for (i=0; i<notes.length; i++){
                    if (notes[i][0] == x && notes[i][1] == y){
                        vlinechange = false
                    }
                }

                if (vlinechange == true) {
                    vLinePosition = x*cellwidth;
                    vLine.setAttribute('style', 'height: 609px; left: '+vLinePosition+'px;');
                    if (playButton.value == '정지'){
                        playButton.value = '재생';
                        playAudio.pause();
                        cancelAnimationFrame(playAnimation);
                    }
                    var currentTimeDelay = x/60;
                    if (playAudio){
                        playAudio.currentTime = currentTimeDelay;
                    }
                }

                selectNote(x, y);

                if (hasInput == true){
                    document.body.removeChild(input);
                    hasInput = false;
                }

                canvas1.onmouseup = function(e) {
                    if (mode == 'select' && vlinechange == false){
                        const curX = parseInt((e.clientX - BCR.left)/cellwidth); 
                        const curY = parseInt((h - (e.clientY - BCR.top))/cellheight);
                        if (x == curX && y == curY){
                            if (hasInput) return;
                            var selectedIndex;
                            addInput(x, y);
                            drawScore();
                        } else {
                            dragNote(x, y, curX, curY);
                        }
                    }
                }
            }
        }

        function addNote (x, y, s=' '){
            var CanAddNote = true
            for (i=0; i<notes.length; i++){
                if (notes[i][0] == x){
                    CanAddNote = false
                    if (notes[i][1] == y){
                        notes.splice(i, 1);
                    }
                }
            }
            if (CanAddNote == true){
                notes.push([x, y, s, false]);
                notes.sort(function(a, b)  {
                    return a[0] - b[0];
                });
            }
        }

        function drawNote(x,y, s=' ', selected=false){
            x=x*cellwidth;
            y= h - y*cellheight - cellheight;
            ctx1.beginPath();
            ctx1.fillStyle = "rgb(40,40,40)";
            if(selected){
                ctx1.strokeStyle = "rgb(141, 148, 219)";
            }else{
                ctx1.strokeStyle = "rgb(40,40,40)";
            }
            ctx1.moveTo(x, y);
            ctx1.lineTo(x, y+cellheight)
            ctx1.stroke();
            ctx1.font = "16px serif";
            ctx1.fillText(s, x + 10, y + cellheight - 5);
        }
    
        function selectNote(x, y){
            for (i=0; i<notes.length; i++){
                if (notes[i][0] == x && notes[i][1] == y){
                    notes[i][3] = true;
                    noteIndex = i
                } else {
                    notes[i][3] = false;
                }
            }

            drawScore();
        }

        function dragNote(x, y, curX, curY){
            if (noteIndex >= 0) {

                if (x != curX || y != curY) {
                    notes[noteIndex][0] = curX
                    notes[noteIndex][1] = curY
                    notes[noteIndex][3] = false;

                    notes.sort(function(a, b)  {
                        return a[0] - b[0];
                    });

                    drawScore();
                }
                
                noteIndex = -1
            }
        }
    
        function removeNote(x, y){
            for (i=0; i<notes.length; i++){
                if (notes[i][0] == x && notes[i][1] == y){
                    notes.splice(i, 1);
                }
            }
        }
    
        function removeValue(value, index, arr) {
            // If the value at the current array index matches the specified value (2)
            if (value[0] === x && value[1] === y) {
            // Removes the value from the original array
                arr.splice(index, 1);
                return true;
            }
            return false;
        }
    
        function addInput(x, y) {
            for (i=0; i<notes.length; i++){
                if (notes[i][0] == x && notes[i][1] == y){
                    var BCR = canvas1.getBoundingClientRect();
                    
                    selectedIndex = i;
                    input = document.createElement('input');
                    input.type = 'text';
                    input.style.position = 'fixed';
                    input.style.zIndex = 2;
                    input.style.left = x * cellwidth + BCR.left + 'px';
                    input.style.top = h - y * cellheight + BCR.top + 'px';
                
                    input.onkeydown = function(e){
                        var keyCode = e.keyCode;
                        if (keyCode === 13) {
                            document.body.removeChild(this);
                            hasInput = false;
                            notes[selectedIndex][2] = this.value;
                            drawScore();
                        }
                    };
                
                    document.body.appendChild(input);
                
                    input.focus();
                
                    hasInput = true;
                }
            }
    
        }

        var currentMidi

        function parseFile(file) {
            //read the file
            const reader = new FileReader();
            reader.onload = function (e) {
                const midi = new Midi(e.target.result);
                notes = []
                for (i = 0; i < midi.tracks[0].notes.length; i++){
                    notes.push([(parseInt(midi.tracks[0].notes[i].ticks/16)+1), midi.tracks[0].notes[i].midi - 54, ' ', false])
                }
                drawScore();
                currentMidi = midi;
            };
            reader.readAsArrayBuffer(file);
        }
    
        const midiSource = document.querySelector('#midiFile')
    
        midiSource.addEventListener("change", (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                const file = files[0];
                var midifileName = file.name.substring(0, file.name.lastIndexOf('.'))
                $(".midi-name").val(midifileName);

                parseFile(file);
            }
        });

        function drawPianoGrid(){
            for(y=0;y<h;y=y+cellheight){
                for(x=0;x<w;x=x+cellwidth){
                if((x/cellwidth) % 60 ==0){
                    ctx.beginPath();    
                    ctx.moveTo(x,0);
                    ctx.strokeStyle = "rgb(254, 254, 254)";
                    ctx.lineTo(x,h);
                    ctx.shadowBlur=0;
                    ctx.stroke();
                    if(y == cellheight){
                        ctx.fillStyle = "rgb(40,40,40)";
                        ctx.font = "16px serif";
                        ctx.fillText(x/cellwidth/60, x+10, 15);
                    }
                } else if ((x/cellwidth) % 10 ==0){
                    ctx.beginPath();    
                    ctx.moveTo(x,0);
                    ctx.strokeStyle = "rgb(245, 245, 245)";
                    ctx.lineTo(x,h);
                    ctx.shadowBlur=0;
                    ctx.stroke();
                }
                ctx.beginPath();
                if((y/cellheight) % 12 == 10 || (y/cellheight) % 12 == 11 || (y/cellheight) % 12 == 1 || (y/cellheight) % 12 == 3 || (y/cellheight) % 12 == 5 || (y/cellheight) % 12 == 6 || (y/cellheight) % 12 == 8 ){
                    ctx.fillStyle = "rgb(239,238,238)";
                }else{
                    ctx.fillStyle = "rgb(189,224,254)";
                }
                ctx.strokeStyle = "rgb(248,248,248)";
                ctx.rect(x, y, cellwidth, cellheight);
                ctx.fill()
                ctx.stroke();
                }
            }
        }

        function drawScore(){
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
                for (i=0; i<notes.length; i++){
                    drawNote(notes[i][0], notes[i][1], notes[i][2], notes[i][3]);
                }
            }
        
        function drawPitchGuide(){
            for (y=0; y<h; y=y+cellheight){
                ctx0.fillStyle = "rgb(40,40,40)";
                ctx0.font = "16px serif";
                ctx0.fillText(pitch[29 - parseInt(y/cellheight)], 10, y - 5);
            }
        }

        function resizeCanvasToDisplaySize(canvas) {
            // look up the size the canvas is being displayed
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
        
            // If it's resolution does not match change it
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                return true;
            }
        
            return false;
            }
        
        var vLine = document.getElementsByClassName('v-line')[0];
        var vLinePosition = 0;
        vLine.setAttribute('style', 'height: 609px; left: '+vLinePosition+'px;');

        saveButton.addEventListener('click', function(event){
            saveArray = ["[0, 0, '']"]
            for (i=0; i < notes.length; i++){
                if (notes[i][2] == 'ch' || notes[i][2] == 's' || notes[i][2] == 'ts' || notes[i][2] == 'z' || notes[i][2] == 'j' || notes[i][2] == 'sh' ){
                    saveArray.push("["+notes[i][0]/2+", 25, '"+notes[i][2]+"']")
                } else {
                    saveArray.push("["+notes[i][0]/2+", "+(notes[i][1] - 3)+", '"+notes[i][2]+"']")
                }
            }
            contents = saveArray.toString()
            const saveFile = new Blob([contents], { type: 'text/plain' });
            const link = document.querySelector("#saveLink");
            link.innerText = '다운로드';
            link.href = URL.createObjectURL(saveFile);
            link.download = fileName+".txt";
        });
        
    } else {
        var url = "https://raw.githubusercontent.com/jyhyun1008/seodangcat/main/page/"+page+".md"
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            document.querySelector(".page_title").innerText = page.substring(page.lastIndexOf('/') + 1)
            document.querySelector("#post").innerHTML += parseMd(out)
    
        })
        .catch(err => { throw err });
    }
    
} else if (model) {
   // async function importModel (model) {
    //    const mymodel = await tf.loadLayersModel('/models/'+model+'/model.json');
   // }
    document.querySelector(".page_title").innerHTML = "<div id='modebar'><i class='bx bx-checkbox-checked selected' id='mode-select'></i></i><i class='bx bx-pencil' id='mode-add'></i><i class='bx bx-eraser' id='mode-remove'></i><i class='bx bx-text' id='mode-text'></i></div>";
    document.querySelector("#post").innerHTML += '미디: <input type="file" id="midiFile" accept=".mid"/> 모델: <input type="file" id="modelFile" accept=".zip"/> <input type="button" value="재생" id="playButton"/>';

    document.querySelector("#piano-roll").innerHTML = '<canvas id="noteguide"></canvas>';
    document.querySelector("#piano-roll").innerHTML += '<canvas id="pianoroll"></canvas>';

    var canvas0 = document.getElementById('noteguide');
    var canvas = document.getElementById('pianoroll');

    resizeCanvasToDisplaySize(canvas); 
    resizeCanvasToDisplaySize(canvas0);

    var ctx0=canvas0.getContext("2d");
    var ctx=canvas.getContext("2d");
    var w = canvas.width;    
    var h = canvas.height;
    var cellwidth=24;
    var cellheight=h/29;

    var mode = 'select'
    var hasInput = false;

    if (!bpm) {
        bpm = 120;
    }
    
    var mobilecanvaslimit = 25000;

    document.querySelector("#mode-select").onclick = function(e){
        document.querySelector("#mode-select").classList.add('selected');
        document.querySelector("#mode-add").classList.remove('selected');
        document.querySelector("#mode-remove").classList.remove('selected');
        document.querySelector("#mode-text").classList.remove('selected');
        mode = 'select';
    }

    document.querySelector("#mode-add").onclick = function(e){
        document.querySelector("#mode-select").classList.remove('selected');
        document.querySelector("#mode-add").classList.add('selected');
        document.querySelector("#mode-remove").classList.remove('selected');
        document.querySelector("#mode-text").classList.remove('selected');
        mode = 'add';
    }

    document.querySelector("#mode-remove").onclick = function(e){
        document.querySelector("#mode-select").classList.remove('selected');
        document.querySelector("#mode-add").classList.remove('selected');
        document.querySelector("#mode-remove").classList.add('selected');
        document.querySelector("#mode-text").classList.remove('selected');
        mode = 'remove';
    }

    document.querySelector("#mode-text").onclick = function(e){
        document.querySelector("#mode-select").classList.remove('selected');
        document.querySelector("#mode-add").classList.remove('selected');
        document.querySelector("#mode-remove").classList.remove('selected');
        document.querySelector("#mode-text").classList.add('selected');
        mode = 'text';
    }

    var notes = [];

    drawPitchGuide();
    drawScore();

    function addNote (x, y, s=' '){
        var CanAddNote = true
        for (i=0; i<notes.length; i++){
            if (notes[i][0] == x){
                CanAddNote = false
            }
        }
        if (CanAddNote == true){
            notes.push([x, y, s, false]);
            notes.sort(function(a, b)  {
                return a[0] - b[0];
            });
        }
    }


    function drawNote(x,y, s=' ', selected=false){
    x=x*cellwidth + 60;
    y= h - y*cellheight - cellheight;
    ctx.beginPath();
    ctx.fillStyle = "rgb(40,40,40)";
    if(selected){
        ctx.strokeStyle = "rgb(75, 139, 59)";
    }else{
        ctx.strokeStyle = "rgb(40,40,40)";
    }
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+cellheight)
    ctx.stroke();
    ctx.font = "16px serif";
    ctx.fillText(s, x + 10, y + cellheight - 5);
    }

    function selectNote(x, y){
        for (i=0; i<notes.length; i++){
            if (notes[i][0] == x && notes[i][1] == y){
                notes[i][3] = true;
            } else {
                notes[i][3] = false;
            }
        }
    }

    function removeNote(x, y){
        for (i=0; i<notes.length; i++){
            if (notes[i][0] == x && notes[i][1] == y){
                notes.splice(i, 1);
            }
        }
    }

    function removeValue(value, index, arr) {
        // If the value at the current array index matches the specified value (2)
        if (value[0] === x && value[1] === y) {
        // Removes the value from the original array
            arr.splice(index, 1);
            return true;
        }
        return false;
    }

    function addInput(x, y) {
        for (i=0; i<notes.length; i++){
            if (notes[i][0] == x && notes[i][1] == y){
                var BCR = canvas.getBoundingClientRect();
                
                selectedIndex = i;
                var input = document.createElement('input');
            
                input.type = 'text';
                input.style.position = 'fixed';
                input.style.zIndex = 2;
                input.style.left = x * cellwidth + 60 + BCR.left + 'px';
                input.style.top = h - y * cellheight + BCR.top + 'px';
            
                input.onkeydown = function(e){
                    var keyCode = e.keyCode;
                    if (keyCode === 13) {
                        document.body.removeChild(this);
                        hasInput = false;
                        notes[selectedIndex][2] = this.value;
                        drawScore();
                    }
                };
            
                document.body.appendChild(input);
            
                input.focus();
            
                hasInput = true;
            }
        }

    }

    canvas.onclick = function(event){
        var BCR = canvas.getBoundingClientRect();
        const x = parseInt((event.clientX - BCR.left - 60)/cellwidth); 
        const y = parseInt((h - (event.clientY - BCR.top))/cellheight);
        if (mode == 'add'){
            addNote(x, y);
            drawScore();
        } else if (mode == 'remove'){
            removeNote(x, y);
            drawScore();
        } else if (mode == 'select'){
            selectNote(x, y);
            drawScore();
        } else if (mode == 'text') {
            if (hasInput) return;
            var selectedIndex;
            addInput(x, y);
        }
    }

   var currentMidi

    function parseFile(file) {
        //read the file
        const reader = new FileReader();
        reader.onload = function (e) {
            const midi = new Midi(e.target.result);
            notes = []
            for (i = 0; i < midi.tracks[0].notes.length; i++){
                notes.push([(midi.tracks[0].notes[i].ticks)/120, midi.tracks[0].notes[i].midi - 54, ' ', false])
            }
            if (isMobile == true){
              canvas.style.width = mobilecanvaslimit + 'px'
              } else {
                            canvas.style.width = midi.tracks[0].endOfTrackTicks/5 + 60 + 'px'
                }

            w = canvas.scrollWidth;    
            resizeCanvasToDisplaySize(canvas)
            drawScore();
            currentMidi = midi;
        };
        reader.readAsArrayBuffer(file);
    }

    const midiSource = document.querySelector('#midiFile')

    midiSource.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            parseFile(file);
        }
    });

    const modelSource = document.querySelector('#modelFile')

    modelSource.addEventListener("change", (evt) => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var zipFile = evt.target.files[0];

        // multithreaded = false is slower and blocks the UI thread if the files
        // inside are compressed, but it can be faster if they are not.
        const getFiles = async (zipFile, multithreaded = true) => {
            const zipBuffer = new Uint8Array(await zipFile.arrayBuffer());
            const unzipped = multithreaded
            ? await new Promise((resolve, reject) => fflate.unzip(
                zipBuffer,
                (err, unzipped) => err
                    ? reject(err)
                    : resolve(unzipped)
                ))
            : fflate.unzipSync(zipBuffer);
            const fileArray = Object.keys(unzipped)
            .filter(filename => unzipped[filename].length > 0)
            .map(filename => new File([unzipped[filename]], filename));
            return fileArray;
        }
        
        getFiles(zipFile).then(function(fileArray){
            console.log(fileArray)
            
            var modelWeights = [0]
            for (var i=0; i<fileArray.length; i++){
                if (fileArray[i].name.includes('.json') && !fileArray[i].name.includes('._')){
                    modelWeights[0] = fileArray[i]
                } else if(fileArray[i].name.includes('.bin')) {
                    modelWeights.push(fileArray[i])
                }
            }
            console.log(modelWeights)

            document.querySelector('#playButton').onclick = function(e) {

                var inputArray = []
                var startTime = []
                var endNote = []
                var mem

                var k = 0;
                var i = 0;

                while (i < notes.length){
                    while (notes[i][0] * bpm / 60 / 16 < (k+1) * 10) {
                        if (i == 0 || startTime.length == endNote.length){
                            startTime.push(notes[i][0])
                        }
                        if (notes[i][2] < ' ') {
                            mem = i
                        }
                        i++;
                        if (i == notes.length) { break; }
                        console.log(k, notes[i][0] * bpm / 60 / 16, (k+1) * 10)
                    }
                    endNote.push(mem)
                    k++;
                }

                var j = 0;

                for (var i = 0; i < notes.length; i++){
                    if (startTime[j] == notes[i][0]){
                        inputArray.push([])
                        j++;
                    }
                    inputArray[j-1].push([notes[i][0] - startTime[j-1], notes[i][1], notes[i][2]])
                }

                console.log(inputArray)
                var inputData = []

                for (var i = 0; i < inputArray.length; i++){
                    inputData.push([])
                    for (k = 0; k < 1770 ; k++){
                        for (l = 0; l < inputArray[i].length; l++){
                            if (l == inputArray[i].length - 1) {
                                if (k >= inputArray[i][l][0] * bpm / 60 / 16 * 177 && k < 1770){
                                    inputData[i].push(tf.transpose(tf.mul(tf.tensor1d(num[inputArray[i][l][2]]).expandDims(1), tf.broadcastTo(freqOneHot.arraySync()[inputArray[i][l][1]], [1, 1000]))))
                                }
                            } else {
                                if (k >= inputArray[i][l][0] * bpm / 60 / 16 * 177 && k < 1770){
                                    inputData[i].push(tf.transpose(tf.mul(tf.tensor1d(num[inputArray[i][l][2]]).expandDims(1), tf.broadcastTo(freqOneHot.arraySync()[inputArray[i][l][1]], [1, 1000]))))
                                }
                            }
                        }
                    }
                }

                drawScore();

                async function importModel (models) {
                    const mymodel = await tf.loadLayersModel(tf.io.browserFiles(models));
                }

                importModel(modelWeights)

            }
        })
    });

    function drawScore(){
    drawPianoGrid();
        for (i=0; i<notes.length; i++){
            drawNote(notes[i][0], notes[i][1], notes[i][2], notes[i][3]);
        }
    }

    function drawNote(x,y, s=' ', selected=false){
    x=x*cellwidth + 60;
    y= h - y*cellheight - cellheight;
    ctx.beginPath();
    ctx.fillStyle = "rgb(40,40,40)";
    if(selected){
        ctx.strokeStyle = "rgb(75, 139, 59)";
    }else{
        ctx.strokeStyle = "rgb(40,40,40)";
    }
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+cellheight)
    ctx.stroke();
    ctx.font = "16px serif";
    ctx.fillText(s, x + 10, y + cellheight - 5);
    }

    function selectNote(x, y){
        for (i=0; i<notes.length; i++){
            if (notes[i][0] == x && notes[i][1] == y){
                notes[i][3] = true;
            } else {
                notes[i][3] = false;
            }
        }
    }

    function removeNote(x, y){
        for (i=0; i<notes.length; i++){
            if (notes[i][0] == x && notes[i][1] == y){
                notes.splice(i, 1);
            }
        }
    }

    function removeValue(value, index, arr) {
        // If the value at the current array index matches the specified value (2)
        if (value[0] === x && value[1] === y) {
        // Removes the value from the original array
            arr.splice(index, 1);
            return true;
        }
        return false;
    }

    function addInput(x, y) {
        for (i=0; i<notes.length; i++){
            if (notes[i][0] == x && notes[i][1] == y){
                var BCR = canvas.getBoundingClientRect();
                
                selectedIndex = i;
                var input = document.createElement('input');
            
                input.type = 'text';
                input.style.position = 'fixed';
                input.style.zIndex = 2;
                input.style.left = x * cellwidth + 60 + BCR.left + 'px';
                input.style.top = h - y * cellheight + BCR.top + 'px';
            
                input.onkeydown = function(e){
                    var keyCode = e.keyCode;
                    if (keyCode === 13) {
                        document.body.removeChild(this);
                        hasInput = false;
                        notes[selectedIndex][2] = this.value;
                        drawScore();
                    }
                };
            
                document.body.appendChild(input);
            
                input.focus();
            
                hasInput = true;
            }
        }

    }

    function drawPlayHead(x){
    ctx.beginPath();    
            ctx.moveTo(x,0);
            ctx.lineWidth = 2;      
            ctx.strokeStyle = "black";
            ctx.lineTo(x,h);
            ctx.shadowBlur=0;
            ctx.stroke();
    }

    function drawPianoGrid(){
    for(y=0;y<h;y=y+cellheight){
        for(x=0;x<w;x=x+cellwidth){
        if((x/cellwidth) % 16 ==0){
            ctx.beginPath();    
            ctx.moveTo(x+60,0);
            ctx.strokeStyle = "rgb(254, 254, 254)";
            ctx.lineTo(x+60,h);
            ctx.shadowBlur=0;
            ctx.stroke();
            if(y == cellheight){
                ctx.fillStyle = "rgb(40,40,40)";
                ctx.font = "16px serif";
                ctx.fillText(x/cellwidth/16 + 1, x+70, 15);
            }
        } else if ((x/cellwidth) % 4 ==0){
            ctx.beginPath();    
            ctx.moveTo(x+60,0);
            ctx.strokeStyle = "rgb(245, 245, 245)";
            ctx.lineTo(x+60,h);
            ctx.shadowBlur=0;
            ctx.stroke();
        }
        ctx.beginPath();
        if((y/cellheight) % 12 == 10 || (y/cellheight) % 12 == 11 || (y/cellheight) % 12 == 1 || (y/cellheight) % 12 == 3 || (y/cellheight) % 12 == 5 || (y/cellheight) % 12 == 6 || (y/cellheight) % 12 == 8 ){
            ctx.fillStyle = "rgb(225,225,225)";
        }else{
            ctx.fillStyle = "rgb(255,219,88)";
        }
        ctx.strokeStyle = "rgb(240,240,240)";
        ctx.rect(x+60, y, cellwidth, cellheight);
        ctx.fill()
        ctx.stroke();
        }
    }
    }

    function drawPitchGuide(){
        for (y=0; y<h; y=y+cellheight){
            ctx0.fillStyle = "rgb(40,40,40)";
            ctx0.font = "16px serif";
            ctx0.fillText(pitch[29 - parseInt(y/cellheight)], 10, y - 5);
        }
    }

    function resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }

    return false;
    }

}