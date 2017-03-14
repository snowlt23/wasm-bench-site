﻿
import nake
import os
import ospaths

proc exe(path: string): string = path.addFileExt(ExeExt)

task "build-c", "":
  discard execShellCmd "emcc -O3 -s WASM=1 -o ./docs/fib-c-wasm.js benchmark/fibonacci.c"
  discard execShellCmd "gcc -o ./dist/fib-c -O3 benchmark/fibonacci.c"

task "build-rust", "":
  discard execShellCmd "rustc -O --target=wasm32-unknown-emscripten -o ./docs/fib-rust-wasm.js benchmark/fibonacci.rs"
  discard execShellCmd "rustc -O -o ./dist/fib-rust benchmark/fibonacci.rs"

task "build-nim", "":
  discard execShellCmd "nim c -d:release -d:emscripten -o:./docs/fib-nim-wasm.js benchmark/fibonacci.nim"
  discard execShellCmd "nim c -d:release benchmark/fibonacci.nim"
  moveFile "benchmark/fibonacci".exe, "dist/fib-nim".exe

task "clone-pages", "":
  for path in walkFiles("./src/*"):
    let (dir, name, ext) = path.splitFile()
    copyFile path, "docs" / name & ext

task "build", "":
  runTask "build-c"
  runTask "build-rust"
  runTask "build-nim"
  runTask "clone-pages"

task "server", "":
  discard execShellCmd "nim c -r -d:release local_server.nim"
