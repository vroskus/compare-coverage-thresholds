#! /usr/bin/env node

/* eslint-disable no-console */

const fs = require('fs');

const keys = ['lines', 'statements', 'functions', 'branches'];

const getPackageJson = () => {
  const file = fs.readFileSync('./package.json');

  if (file) {
    return JSON.parse(file);
  }

  return null;
};

const getCoverageSummary = () => {
  const file = fs.readFileSync('./coverage/coverage-summary.json');

  if (file) {
    return JSON.parse(file);
  }

  return null;
};

const isPackageJsonCompatible = ({
  packageJson,
}) => {
  if (packageJson.jest
    && packageJson.jest.coverageThreshold
    && packageJson.jest.coverageThreshold.global
  ) {
    return true;
  }

  console.log('package.json is incompatible');

  return false;
};

const isCoverageSummaryCompatible = ({
  coverageSummary,
}) => {
  if (coverageSummary.total) {
    return true;
  }

  console.log('coverage-summary.json is incompatible');

  return false;
};

const getThresholdIssues = ({
  coverageSummary,
  packageJson,
}) => {
  const issues = [];

  const packageJsonOk = isPackageJsonCompatible({
    packageJson,
  });
  const coverageSummaryOk = isCoverageSummaryCompatible({
    coverageSummary,
  });

  if (packageJsonOk === true && coverageSummaryOk === true) {
    keys.forEach((key) => {
      const summaryKeyValue = coverageSummary.total[key].pct;
      const thresholdKeyValue = packageJson.jest.coverageThreshold.global[key];

      if (summaryKeyValue < thresholdKeyValue) {
        issues.push(`Jest: "global" coverage threshold for ${key} (${thresholdKeyValue}%) not met: ${summaryKeyValue}%`);
      }
    });
  }

  return issues;
};

const main = () => {
  const packageJson = getPackageJson();

  if (packageJson === null) {
    console.warning('Unable to get ./package.json');

    return process.exit(0);
  }

  const coverageSummary = getCoverageSummary();

  if (coverageSummary === null) {
    console.warning('Unable to get ./coverage/coverage-summary.json');

    return process.exit(0);
  }

  const issues = getThresholdIssues({
    coverageSummary,
    packageJson,
  });

  if (issues.length !== 0) {
    issues.forEach((issue) => {
      console.error(
        '\x1b[31m%s\x1b[0m',
        issue,
      );
    });

    return process.exit(1);
  }

  return process.exit(0);
};

main();
