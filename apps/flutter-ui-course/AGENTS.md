<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-03 | Updated: 2026-05-03 -->

# flutter-ui-course

## Purpose
A Flutter application containing UI course lessons and examples. It is integrated into the Nx workspace structure.

## Key Files
| File | Description |
|------|-------------|
| `pubspec.yaml` | Flutter package dependencies and metadata |
| `project.json` | Nx project configuration for this app |
| `analysis_options.yaml` | Dart analyzer and linting rules |
| `README.md` | Project-specific documentation |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `lib/` | Main Dart source code for the application (see `lib/AGENTS.md`) |
| `test/` | Flutter widget and unit tests (see `test/AGENTS.md`) |
| `android/` | Android specific native build files |
| `ios/` | iOS specific native build files |

## For AI Agents

### Working In This Directory
- This is a Flutter application. Use `flutter` and `dart` CLI tools.
- Run `flutter analyze` to check for issues.
- Format code with `dart format .`.

### Testing Requirements
- Run tests using `flutter test` or `npx nx test flutter-ui-course`.

### Common Patterns
- Extract widgets into separate files when complex (>50 lines).
- Use `const` constructors for immutable widgets.
- Prefer `StatelessWidget` over `StatefulWidget` when state isn't needed.

## Dependencies

### Internal
- N/A

### External
- Flutter SDK
- Dart SDK

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
