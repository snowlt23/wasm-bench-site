
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

function loadWasm(wasmurl, jsurl) {
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
            arguments: [getN()]
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

function benchmarkScript(language, script) {
    return new Promise((resolve, reject) => {
        const n = getN();
        const start = Date.now();
        script.addEventListener('load', () => {
            const end = Date.now();
            const elapsed = (end - start) / 1000;
            appendBenchResult(language, n, elapsed);
            resolve();
        });
        document.body.appendChild(script);
    });
}

function benchmarkJSFib() {
    return new Promise((resolve, reject) => {
        const n = getN();
        const start = Date.now();
        console.log(`fibonacci(${n}) = ${fibonacci(n)}`);
        const end = Date.now();
        const elapsed = (end - start) / 1000;
        appendBenchResult("JavaScript", n, elapsed);
        resolve();
    });
}

function benchmarkCFib() {
    return loadWasm('${baseurl}/fib-c-wasm.wasm', '${baseurl}/fib-c-wasm.js')
        .then(script => benchmarkScript('C', script));
}

function benchmarkRustFib() {
    return loadWasm('${baseurl}/fib-rust-wasm.wasm', '${baseurl}/fib-rust-wasm.js')
        .then(script => benchmarkScript('Rust', script));
}

function benchmarkNimFib() {
    return loadWasm('${baseurl}/fib-nim-wasm.wasm', '${baseurl}/fib-nim-wasm.js')
        .then(script => benchmarkScript('Nim', script));
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
    benchmarkJSFib();
});

const cRunbtn = document.getElementById('run-c');
cRunbtn.addEventListener('click', event => {
    benchmarkCFib();
});

const rustRunbtn = document.getElementById('run-rust');
rustRunbtn.addEventListener('click', event => {
    benchmarkRustFib();
});

const nimRunbtn = document.getElementById('run-nim');
nimRunbtn.addEventListener('click', event => {
    benchmarkNimFib();
});

const allRunbtn = document.getElementById('run-all');
allRunbtn.addEventListener('click', event => {
    benchmarkJSFib()
        .then(benchmarkCFib)
        .then(benchmarkRustFib)
        .then(benchmarkNimFib);
});
