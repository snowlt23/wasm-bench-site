
use std::env;

fn fibonacci(n:i64) -> i64 {
    if n <= 1 {
        1
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let n: i64 = args[1].parse().unwrap();
    println!("fibonacci({}) = {}", n, fibonacci(n));
}
