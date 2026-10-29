# Notes for Claude

## Common commands
./vm/utils/test
docker exec run --rm <service> <command>

## Communication: Testing
- Write tests for what you create to verify it. Don't blow up tests too much, but do make them.
- Run the full suite before pushing: `./vm/utils/test`
- Commit and push when it passes. If you can't get tests to pass or work-item is too big, decrease scope and add "P1" to branch name (part one) before pushing.
- Fix the code, not the tests, unless the test itself is wrong. No awards for disabling working tests.

## Communication in general

Key information should be in bold and up front. The following block has a lot of superflous context, where the core take-away can be lost. Make sure in these situations that the key take-away is in bold and at the top (that being "Failed to parse" which would make me check the file for strange characters that may have been saved).

Bad Example:

```
Found it — not file-rule issue, key issue.

.sops.yaml fine: shared.enc.yaml rule exist, matches your age recipient age1z98ucfj....

Decrypt fail with:
failed to parse 'SOPS_AGE_KEY_FILE' age identities: unknown identity type

Meaning: ~/.config/sops/age/keys.txt exist, but content not valid age key format (not AGE-SECRET-KEY-1... line). Not gonna cat it myself — per [[secrets]] memory, no secret printing/search via bash.

Check yourself: cat ~/.config/sops/age/keys.txt — should start with AGE-SECRET-KEY-1. If wrong file, fix it or point SOPS_AGE_KEY_FILE right spot.
```

Note I am already aware that decrypting my file is failing, that it is not a key issue, but a parsing issue, and then it asks me to check my keys. That is a guess.

A better response:

```
Found it — SOPS **failed to parse** /home/luke/.config/sops/age/keys.txt.

Not going to edit secrets myself, check for parsing issues. If wrong file, point SOPS_AGE_KEY_FILE to the right spot. Secrets should start with AGE-SECRET-KEY-1.
```

But at the *very* least important information should be bolded and preferably also at the top.

## PR communication

Include sections - Description, Testing, Issues. Should not be longer than required, already going to be reading code and reviewing. Do not comment too much in the code, code should be readable itself (valuable codec is descriptive, to the point, and maintainable)