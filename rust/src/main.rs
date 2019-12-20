use std::string::String;

fn hoge() -> String {
    "".to_owned()
}

fn main() {
    let h = hoge();
    println!("{}", h);
}
