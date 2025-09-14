use echoes::ROADS;

#[derive(Debug)]
#[allow(dead_code)]
struct Unit<'a> {
    name: &'a str,
    steps: &'a [u8],
    kind: &'a str,
}

fn eq_steps(a: &[u8], b: &[u8]) -> bool {
    a.len() == b.len() && a.iter().zip(b).all(|(x, y)| x == y)
}

fn main() {
    // Tetrachords (4) and Pentachords (5)
    let tetras = vec![
        Unit {
            name: "Ουσάκ",
            steps: &[1, 2, 2],
            kind: "4",
        },
        Unit {
            name: "Μινόρε",
            steps: &[2, 1, 2],
            kind: "4",
        },
        Unit {
            name: "Σαμπάχ",
            steps: &[2, 1, 1],
            kind: "4",
        },
        Unit {
            name: "Ραστ",
            steps: &[2, 2, 1],
            kind: "4",
        },
        Unit {
            name: "Χιτζάζ",
            steps: &[1, 3, 1],
            kind: "4",
        },
        Unit {
            name: "Χουζάμ",
            steps: &[3, 1, 1],
            kind: "4",
        },
    ];
    let pentas = vec![
        Unit {
            name: "Ουσάκ",
            steps: &[1, 2, 2, 2],
            kind: "5",
        },
        Unit {
            name: "Μινόρε",
            steps: &[2, 1, 2, 2],
            kind: "5",
        },
        Unit {
            name: "Νικρίζ",
            steps: &[2, 1, 3, 1],
            kind: "5",
        },
        Unit {
            name: "Σαμπάχ",
            steps: &[2, 1, 1, 3],
            kind: "5",
        },
        Unit {
            name: "Ραστ",
            steps: &[2, 2, 1, 2],
            kind: "5",
        },
        Unit {
            name: "Χιτζάζ",
            steps: &[1, 3, 1, 2],
            kind: "5",
        },
        Unit {
            name: "Χουζάμ",
            steps: &[3, 1, 1, 2],
            kind: "5",
        },
    ];

    for r in ROADS {
        let mut matches: Vec<String> = Vec::new();
        // Collect 5 + 4
        for p in &pentas {
            for t in &tetras {
                let mut combo = Vec::with_capacity(7);
                combo.extend_from_slice(p.steps);
                combo.extend_from_slice(t.steps);
                if eq_steps(&combo, r.steps) {
                    matches.push(format!("{}(5) + {}(4)", p.name, t.name));
                }
            }
        }
        // Collect 4 + 5
        for t in &tetras {
            for p in &pentas {
                let mut combo = Vec::with_capacity(7);
                combo.extend_from_slice(t.steps);
                combo.extend_from_slice(p.steps);
                if eq_steps(&combo, r.steps) {
                    matches.push(format!("{}(4) + {}(5)", t.name, p.name));
                }
            }
        }
        if matches.is_empty() {
            println!("{} => no decomposition found", r.name);
        } else {
            println!("{} => {}", r.name, matches.join(" | "));
        }
    }
}
