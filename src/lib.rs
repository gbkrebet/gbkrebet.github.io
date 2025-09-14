pub const NOTES: [&str; 12] = [
    "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si",
];

#[derive(Debug, Clone)]
pub struct Road {
    pub name: &'static str,
    pub distances: &'static str,
    pub steps: &'static [u8], // semitone steps between successive notes
}

pub const ROADS: &[Road] = &[
    Road { name: "Ουσάκ", distances: "H-T-T-T-H-T-T", steps: &[1, 2, 2, 2, 1, 2, 2] },
    Road { name: "Φυσικό Μινόρε", distances: "T-H-T-T-H-T-T", steps: &[2, 1, 2, 2, 1, 2, 2] },
    Road { name: "Αρμονικό Μινόρε", distances: "T-H-T-T-H-3H-H", steps: &[2, 1, 2, 2, 1, 3, 1] },
    Road { name: "Νιαβέντ", distances: "T-H-3H-H-H-3H-H", steps: &[2, 1, 3, 1, 1, 3, 1] },
    Road { name: "Νικρίζ", distances: "T-H-3H-H-T-T-H", steps: &[2, 1, 3, 1, 2, 2, 1] },
    Road { name: "Καρσιγάρ", distances: "T-H-T-H-3H-H-T", steps: &[2, 1, 2, 1, 3, 1, 2] },
    Road { name: "Χιτζάζ", distances: "H-3H-H-T-H-T-T", steps: &[1, 3, 1, 2, 1, 2, 2] },
    Road { name: "Χιτζασκιάρ", distances: "H-3H-H-T-H-3H-H", steps: &[1, 3, 1, 2, 1, 3, 1] },
    Road { name: "Πειραιώτικος", distances: "H-3H-T-H-H-3H-H", steps: &[1, 3, 2, 1, 1, 3, 1] },
    Road { name: "Ραστ", distances: "T-T-H-T-T-T-H", steps: &[2, 2, 1, 2, 2, 2, 1] },
    Road { name: "Χουζάμ", distances: "3H-H-H-T-H-3H-H", steps: &[3, 1, 1, 2, 1, 3, 1] },
    Road { name: "Σεγκιά", distances: "3H-H-H-T-T-T-H", steps: &[3, 1, 1, 2, 2, 2, 1] },
];

pub fn index_of_note(note: &str) -> Option<usize> {
    NOTES.iter().position(|&n| n.eq_ignore_ascii_case(note))
}

pub fn notes_for(tonic: &str, steps: &[u8]) -> Option<Vec<String>> {
    let start = index_of_note(tonic)?;
    let mut idx = start;
    let mut notes = Vec::with_capacity(steps.len() + 1);
    notes.push(NOTES[idx].to_string());
    for &s in steps {
        idx = (idx + s as usize) % NOTES.len();
        notes.push(NOTES[idx].to_string());
    }
    Some(notes)
}

// --- Enharmonic spelling (solfege with #/b) ---
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
enum Letter { Do, Re, Mi, Fa, Sol, La, Si }

fn base_pc(letter: Letter) -> usize {
    match letter {
        Letter::Do => 0,
        Letter::Re => 2,
        Letter::Mi => 4,
        Letter::Fa => 5,
        Letter::Sol => 7,
        Letter::La => 9,
        Letter::Si => 11,
    }
}

fn letter_name(letter: Letter) -> &'static str {
    match letter {
        Letter::Do => "Do",
        Letter::Re => "Re",
        Letter::Mi => "Mi",
        Letter::Fa => "Fa",
        Letter::Sol => "Sol",
        Letter::La => "La",
        Letter::Si => "Si",
    }
}

fn parse_base_letter(name: &str) -> Option<Letter> {
    // Order matters: "Sol" vs "Si"
    if name.starts_with("Sol") { return Some(Letter::Sol); }
    if name.starts_with("Si") { return Some(Letter::Si); }
    if name.starts_with("Do") { return Some(Letter::Do); }
    if name.starts_with("Re") { return Some(Letter::Re); }
    if name.starts_with("Mi") { return Some(Letter::Mi); }
    if name.starts_with("Fa") { return Some(Letter::Fa); }
    if name.starts_with("La") { return Some(Letter::La); }
    None
}

fn name_to_pc(name: &str) -> Option<usize> {
    let s = name.trim();
    let letter = parse_base_letter(s)?;
    let base = base_pc(letter);
    let acc = &s[letter_name(letter).len()..];
    let pc = match acc {
        "#" => (base + 1) % 12,
        "b" => (base + 11) % 12,
        "" => base,
        _ => return None,
    };
    Some(pc)
}

fn letter_cycle_from(tonic: &str) -> [Letter; 7] {
    // Rotate the base letters to start from the tonic's base letter
    let base = parse_base_letter(tonic).unwrap_or(Letter::Mi); // default shouldn't happen with our inputs
    let all = [Letter::Do, Letter::Re, Letter::Mi, Letter::Fa, Letter::Sol, Letter::La, Letter::Si];
    let start_idx = all.iter().position(|&l| l == base).unwrap_or(0);
    let mut out = [Letter::Do; 7];
    for i in 0..7 { out[i] = all[(start_idx + i) % 7]; }
    out
}

fn sharp_name_for_pc(pc: usize) -> &'static str {
    NOTES[pc % 12]
}

/// Compute spelled notes for a road starting from tonic, ensuring one of each letter
/// per octave, using # or b where necessary.
pub fn spelled_notes_for(tonic: &str, steps: &[u8]) -> Option<Vec<String>> {
    // Determine starting pitch class from tonic (accepts Do/Do#/Dob style)
    let start_pc = name_to_pc(tonic).or_else(|| index_of_note(tonic))?;
    let mut pcs: Vec<usize> = Vec::with_capacity(steps.len() + 1);
    pcs.push(start_pc);
    let mut idx = start_pc;
    for &s in steps {
        idx = (idx + s as usize) % NOTES.len();
        pcs.push(idx);
    }
    let letters = letter_cycle_from(tonic);
    let mut names: Vec<String> = Vec::with_capacity(pcs.len());
    for (i, &pc) in pcs.iter().enumerate() {
        let letter = letters[i % 7];
        let base = base_pc(letter);
        let diff = (pc + 12 - base) % 12;
        let spelled = match diff {
            0 => letter_name(letter).to_string(),
            1 => format!("{}#", letter_name(letter)),
            11 => format!("{}b", letter_name(letter)),
            _ => sharp_name_for_pc(pc).to_string(),
        };
        names.push(spelled);
    }
    Some(names)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn niavend_from_mi_matches_example() {
        let road = ROADS.iter().find(|r| r.name == "Νιαβέντ").unwrap();
        let notes = notes_for("Mi", road.steps).unwrap();
        assert_eq!(notes, vec![
            "Mi", "Fa#", "Sol", "La#", "Si", "Do", "Re#", "Mi"
        ]);
    }

    #[test]
    fn niavend_from_sol_spelling_uses_flats() {
        let road = ROADS.iter().find(|r| r.name == "Νιαβέντ").unwrap();
        let notes = spelled_notes_for("Sol", road.steps).unwrap();
        assert_eq!(notes, vec![
            "Sol", "La", "Sib", "Do#", "Re", "Mib", "Fa#", "Sol"
        ]);
    }
}
