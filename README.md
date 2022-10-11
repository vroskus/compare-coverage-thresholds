# @vroskus/check-coverage-thresholds

Tool for comparing code coverage thresholds values in package.json agaist the generated json coverage summary report.

## Installation

Call:

`npm install -D @vroskus/check-coverage-thresholds`

`yarn add -D @vroskus/check-coverage-thresholds`

## Usage

1. Make sure that your test framework uses `json-summary` reporter and has already produced a `coverage/coverage-summary.json`. It is needed to get coverage results for analysis. 
2. Ensure that you have some threshold values specified in package.json (you can start with `0`). Example:

```json
// package.json
...
  "jest": {
    "coverageThreshold": {
      "global": {
        "lines": 0,
        "statements": 0,
        "branches": 0,
        "functions": 0,
      }
    }
  }
...
```

3. Call `check-coverage-thresholds` after running tests, for example:

```json
// package.json
...
"scripts": {
    "test": "jest",
    "posttest": "check-coverage-thresholds",
}
...
```

When the tool is called, it finds coverage information, compares results with stored threshold values, and exits with  exit code 0 if threshold values are equal or higher, otherwise script exits with exit code 1 printing out not met values.
