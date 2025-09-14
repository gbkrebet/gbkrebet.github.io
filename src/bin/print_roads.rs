use echoes::{notes_for, ROADS, NOTES};

fn main() {
    let tonic = std::env::args().nth(1).unwrap_or_else(|| "Mi".to_string());
    if !NOTES.iter().any(|n| n.eq_ignore_ascii_case(&tonic)) {
        eprintln!("Unknown tonic: {}\nValid: {}", tonic, NOTES.join(", "));
        std::process::exit(1);
    }
    for road in ROADS {
        let notes = notes_for(&tonic, road.steps).unwrap();
        println!("{} ({})", road.name, road.distances);
        println!("  {}\n", notes.join(", "));
    }
}

