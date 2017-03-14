
#include <stdint.h>
#include <inttypes.h>
#include <stdio.h>
#include <stdlib.h>

int64_t fibonacci(int64_t n) {
    if (n <= 1) {
        return 1;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

int main(int argc, char** argv) {
    int n = atoi(argv[1]);
    printf("fibonacci(%d) = %" PRId64 "\n", n, fibonacci(n));
    return 0;
}
