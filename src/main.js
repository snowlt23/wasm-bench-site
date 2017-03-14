
let benchCount = 1;
function appendBenchResult(language, n, elapsed) {
    const resultTableElem = document.getElementById('result-table');
    const elem = document.createElement('tr');
    elem.innerHTML += `<th scope="row">${benchCount}</th>`
    elem.innerHTML += `<td>${language}</td>`;
    elem.innerHTML += `<td>${n}</td>`;
    elem.innerHTML += `<td>${elapsed}</td>`;
    resultTableElem.appendChild(elem);
    benchCount += 1;
}

function benchmarkMain(language, n, script) {
    const start = Date.now();
    script.addEventListener('load', () => {
        const end = Date.now();
        const elapsed = (end - start) / 1000;
        appendBenchResult(language, n, elapsed);
    });
    document.body.appendChild(script);
}

function loadWasm(wasmurl, jsurl, n) {
    return new Promise((resolve, reject) => {
        window.Module = {
            preRun: [],
            postRun: [],
            print: (text) => {
                console.log(text);
            },
            printErr: (text) => {
                console.log(text);
            },
            arguments: [n]
        };
        const xhr = new XMLHttpRequest();
        xhr.open('GET', wasmurl, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            Module.wasmBinary = xhr.response;
            const script = document.createElement('script');
            script.src = jsurl;
            resolve(script);
        };
        xhr.send(null);
    });
}

function getN() {
    return document.getElementById('n-number').value;
}

function fibonacci(n) {
    if (n <= 1) {
        return 1;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

const jsRunbtn = document.getElementById('run-js');
jsRunbtn.addEventListener('click', event => {
    const n = getN();
    const start = Date.now();
    console.log(`fibonacci(${n}) = ${fibonacci(n)}`);
    const end = Date.now();
    const elapsed = (end - start) / 1000;
    appendBenchResult("JS", n, elapsed);
});

const cRunbtn = document.getElementById('run-c');
cRunbtn.addEventListener('click', event => {
    const n = getN();
    loadWasm('${baseurl}/fib-c-wasm.wasm', '${baseurl}/fib-c-wasm.js', n)
        .then(script => {
            benchmarkMain('C', n, script); 
        });
});

const rustRunbtn = document.getElementById('run-rust');
rustRunbtn.addEventListener('click', event => {
    const n = getN();
    loadWasm('${baseurl}/fib-rust-wasm.wasm', '${baseurl}/fib-rust-wasm.js', n)
        .then(script => {
            benchmarkMain('Rust', n, script); 
        });
});

const nimRunbtn = document.getElementById('run-nim');
nimRunbtn.addEventListener('click', event => {
    const n = getN();
    loadWasm('${baseurl}/fib-nim-wasm.wasm', '${baseurl}/fib-nim-wasm.js', n)
        .then(script => {
            benchmarkMain('Nim', n, script); 
        });
});
