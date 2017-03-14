
import nake
import os
import ospaths
import strutils

proc exe*(path: string): string = path.addFileExt(ExeExt)

var baseurl = ""
proc setBaseURL*(url: string) = baseurl = url
proc replaceBaseURL*(s: string): string = s.replace("${baseurl}", baseurl)

var disturl = "dist"
proc setDistURL*(url: string) = disturl = url

task "build-c", "":
  discard execShellCmd "emcc -O3 -s WASM=1 -o $#/fib-c-wasm.js benchmark/fibonacci.c" % disturl
  discard execShellCmd "gcc -o ./dist/fib-c -O3 benchmark/fibonacci.c"

task "build-rust", "":
  discard execShellCmd "rustc -O --target=wasm32-unknown-emscripten -o $#/fib-rust-wasm.js benchmark/fibonacci.rs" % disturl
  discard execShellCmd "rustc -O -o ./dist/fib-rust benchmark/fibonacci.rs"

task "build-nim", "":
  discard execShellCmd "nim c -d:release -d:emscripten -o:$#/fib-nim-wasm.js benchmark/fibonacci.nim" % disturl
  discard execShellCmd "nim c -d:release benchmark/fibonacci.nim"
  moveFile "benchmark/fibonacci".exe, "dist/fib-nim".exe

task "clone-pages", "":
  for path in walkFiles("./src/*"):
    let (dir, name, ext) = path.splitFile()
    let src = readFile(path).replaceBaseURL()
    writeFile disturl / name & ext, src

task "build", "":
  runTask "build-c"
  runTask "build-rust"
  runTask "build-nim"
  runTask "clone-pages"

task "github-build", "":
  setDistURL "docs"
  setBaseURL "https://snowlt23.github.io/wasm-bench-site"
  runTask "build"

task "local-build", "":
  setDistURL "dist"
  setBaseURL ""
  runTask "build"

task "server", "":
  discard execShellCmd "nim c -r -d:release local_server.nim"
