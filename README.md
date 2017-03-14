
# wasm-bench-site

this is fibonacci benchmark on WASM. (aka WebAssembly)

this benchmark running your latest web browser.  
have fun! <https://snowlt23.github.io/wasm-bench-site/>

# Local Usage

**Requirements**
- Nim Compiler (testing on devel branch of github)
  - nimble (attached to compiler by default)
- Emscripten (sdk-incoming-64bit)

```
$ nimble install nake
$ nake local-build
$ nake server
```

Access to `localhost:5000` at your web browser!