use std::process::Command;

// Helper to run the compiled binary produced by Cargo for tests.
fn run_bin(args: &[&str]) -> (i32, String, String) {
    let bin = env!("CARGO_BIN_EXE_print_roads");
    let out = Command::new(bin).args(args).output().expect("run binary");
    let code = out.status.code().unwrap_or(-1);
    let stdout = String::from_utf8_lossy(&out.stdout).to_string();
    let stderr = String::from_utf8_lossy(&out.stderr).to_string();
    (code, stdout, stderr)
}

#[test]
fn prints_for_sol() {
    let (code, stdout, stderr) = run_bin(&["Sol"]);
    assert_eq!(code, 0, "non-zero exit: {}\nstderr: {}", code, stderr);
    // Spot-check a few expected lines
    assert!(stdout.contains("Ουσάκ (H-T-T-T-H-T-T)"));
    assert!(stdout.contains("Νιαβέντ (T-H-3H-H-H-3H-H)"));
    assert!(stdout.contains("  Sol, La, Sib, Do#, Re, Mib, Fa#, Sol"));
}

#[test]
fn accepts_flats_and_lowercase() {
    // Lowercase tonic should be accepted (case-insensitive parsing)
    let (code1, stdout1, _) = run_bin(&["sol"]);
    assert_eq!(code1, 0);
    assert!(stdout1.contains("  Sol, La, Sib, Do#, Re, Mib, Fa#, Sol"));

    // Flat tonic should be accepted and not error
    let (code2, _stdout2, stderr2) = run_bin(&["Lab"]);
    assert_eq!(code2, 0, "stderr: {}", stderr2);
}
