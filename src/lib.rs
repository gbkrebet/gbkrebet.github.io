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
}
