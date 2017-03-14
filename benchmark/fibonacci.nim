
import os
import times
import strutils

proc fibonacci*(n: int64): int64 =
  if n <= 1'i64:
    1'i64
  else:
    fibonacci(n - 1'i64) + fibonacci(n - 2'i64)

proc main() =
  let args = commandLineparams()
  let n = args[0].parseInt()
  echo "fibonacci($#) = $#" % [$n, $fibonacci(n.int64)]

main()
