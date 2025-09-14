use echoes::{spelled_notes_for, NOTES, ROADS};

fn main() {
    let tonic = std::env::args().nth(1).unwrap_or_else(|| "Mi".to_string());
    // Accept enharmonic inputs too (e.g., "Lab", "Solb"), not only entries in NOTES.
    // We'll validate by attempting to compute spelled notes for the first road.
    if ROADS
        .first()
        .and_then(|r| spelled_notes_for(&tonic, r.steps))
        .is_none()
    {
        eprintln!(
            "Unknown tonic: {}\nAccepted: base Do/Re/Mi/Fa/Sol/La/Si with optional # or b (e.g., Do, Do#, Reb)",
            tonic
        );
        eprintln!("Common names: {}", NOTES.join(", "));
        std::process::exit(1);
    }
    for road in ROADS {
        let notes = spelled_notes_for(&tonic, road.steps).unwrap();
        println!("{} ({})", road.name, road.distances);
        println!("  {}\n", notes.join(", "));
    }
}
