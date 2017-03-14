
# wasm-bench-site

this is fibonacci benchmark on WASM. (aka WebAssembly)

this benchmark running your latest web browser.  
have fun! <https://snowlt23.github.io/wasm-bench-site/>

# Local Usage

**Requirements**
- GNU C Compier (aka `gcc`)
- Nim Compiler (testing on devel branch of github)
  - nimble (attached to compiler by default)
- Rust Compiler (with `wasm32-unknown-emscripten` component)
- Emscripten (sdk-incoming-64bit)

```
$ nimble install nake
$ nake local-build
$ nake server
```

Access to `localhost:5000` at your web browser!