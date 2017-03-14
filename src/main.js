
function loadWasm(filename, imports) {
    return fetch(filename)
        .then(response => response.arrayBuffer())
        .then(bytes => WebAssembly.compile(bytes))
        .then(module => {
            imports = imports || {};
            imports.env = imports.env || {};
            imports.env.memoryBase = 0;
            imports.env.tableBase = 0;
            imports.env.printf = arg => console.log(arg);
            if (!imports.env.memory) {
                imports.env.memory = new WebAssembly.Memory({
                    initial: 256
                });
            }
            if (!imports.env.table) {
                imports.env.table = new WebAssembly.Table({
                    initial: 0,
                    element: 'anyfunc'
                });
            }
            return WebAssembly.instantiate(module, imports);
        });
}

const benchCount = 0;
function benchmarkMain(language, mainfn) {
    const start = Date.now();
    mainfn();
    const end = Data.now();
    const elapsed = (end - start) / 1000;
    
    const resultTableElem = document.getElementById('result-table');
    const elem = document.createElement('tr');
    elem.innerHTML += `<th scope="row">${benchCount}</th>`
    elem.innerHTML += `<td>${language}</td>`;
    elem.innerHTML += `<td>${elapsed}</td>`
    resultTableElem.appendChild(elem);

    benchCount += 1;
}


// loadWasm('/fib-c-wasm.wasm').then(instance => {
//     const exports = instance.exports;
//     const runbtn = document.getElementById('run-c');
//     runbtn.addEventListener('click', event => {
//         benchmarkMain("C", exports.main);
//     });
// });
// loadWasm('/fib-rust-wasm.wasm').then(instance => {
//     const exports = instance.exports;
//     const runbtn = document.getElementById('run-rust');
//     runbtn.addEventListener('click', event => {
//         benchmarkMain("Rust", exports.main);
//     });
// });
// loadWasm('/fib-nim-wasm.wasm').then(instance => {
//     const exports = instance.exports;
//     const runbtn = document.getElementById('run-nim');
//     runbtn.addEventListener('click', event => {
//         benchmarkMain("Nim", exports.main);
//     });
// });



