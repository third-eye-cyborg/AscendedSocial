/**
 * Bearer Security Scanning Script
 * Runs Bearer SAST (Static Application Security Testing) to detect security and privacy risks
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

interface BearerScanOptions {
  path?: string;
  format?: 'text' | 'json' | 'sarif' | 'html';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  output?: string;
  report?: 'security' | 'privacy' | 'dataflow';
  failOnSeverity?: 'critical' | 'high' | 'medium' | 'low';
}

async function runBearerScan(options: BearerScanOptions = {}) {
  const {
    path = '.',
    format = 'json',
    severity = 'medium',
    output,
    report,
    failOnSeverity = 'high'
  } = options;

  console.log('🛡️ Starting Bearer security scan...');
  console.log(`📂 Scanning path: ${path}`);
  console.log(`📊 Minimum severity: ${severity}`);
  console.log(`📝 Output format: ${format}`);
  
  if (report) {
    console.log(`📋 Report type: ${report}`);
  }

  try {
    // Build Bearer command
    let command = `bearer scan ${path} --format ${format} --severity ${severity}`;
    
    if (report) {
      command += ` --report ${report}`;
    }
    
    if (output && format !== 'text') {
      command += ` --output ${output}`;
    }

    console.log(`🔍 Running: ${command}\n`);

    const result = execSync(command, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      stdio: 'pipe'
    });

    // Process results
    if (format === 'json') {
      const scanResults = JSON.parse(result);
      console.log('\n📊 Scan Results Summary:');
      
      if (scanResults.findings) {
        const criticalCount = scanResults.findings.filter((f: any) => f.severity === 'critical').length;
        const highCount = scanResults.findings.filter((f: any) => f.severity === 'high').length;
        const mediumCount = scanResults.findings.filter((f: any) => f.severity === 'medium').length;
        const lowCount = scanResults.findings.filter((f: any) => f.severity === 'low').length;
        
        console.log(`   🔴 Critical: ${criticalCount}`);
        console.log(`   🟠 High: ${highCount}`);
        console.log(`   🟡 Medium: ${mediumCount}`);
        console.log(`   🟢 Low: ${lowCount}`);
        console.log(`   📊 Total: ${scanResults.findings.length}`);
      }

      if (output) {
        writeFileSync(output, JSON.stringify(scanResults, null, 2));
        console.log(`\n✅ Results saved to: ${output}`);
      }
    } else {
      console.log(result);
    }

    console.log('\n✅ Bearer scan completed successfully');
    process.exit(0);
  } catch (error: any) {
    // Bearer returns non-zero exit code when vulnerabilities are found
    if (error.stdout) {
      const output = error.stdout.toString();
      
      if (format === 'json' && output) {
        try {
          const scanResults = JSON.parse(output);
          
          console.log('\n📊 Scan Results Summary:');
          
          if (scanResults.findings) {
            const criticalCount = scanResults.findings.filter((f: any) => f.severity === 'critical').length;
            const highCount = scanResults.findings.filter((f: any) => f.severity === 'high').length;
            const mediumCount = scanResults.findings.filter((f: any) => f.severity === 'medium').length;
            const lowCount = scanResults.findings.filter((f: any) => f.severity === 'low').length;
            
            console.log(`   🔴 Critical: ${criticalCount}`);
            console.log(`   🟠 High: ${highCount}`);
            console.log(`   🟡 Medium: ${mediumCount}`);
            console.log(`   🟢 Low: ${lowCount}`);
            console.log(`   📊 Total: ${scanResults.findings.length}`);

            // Check if we should fail based on severity
            const shouldFail = (
              (failOnSeverity === 'low' && scanResults.findings.length > 0) ||
              (failOnSeverity === 'medium' && (mediumCount + highCount + criticalCount) > 0) ||
              (failOnSeverity === 'high' && (highCount + criticalCount) > 0) ||
              (failOnSeverity === 'critical' && criticalCount > 0)
            );

            if (shouldFail) {
              console.error(`\n❌ Security vulnerabilities found at or above ${failOnSeverity} severity`);
              process.exit(1);
            }
          }
        } catch (parseError) {
          console.error('❌ Failed to parse Bearer output:', parseError);
          console.log(output);
          process.exit(1);
        }
      } else {
        console.log(output);
      }
      
      console.log('\n✅ Bearer scan completed with findings');
      process.exit(0);
    } else {
      console.error('❌ Bearer scan failed:', error.message);
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: BearerScanOptions = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  switch (arg) {
    case '--path':
      options.path = args[++i];
      break;
    case '--format':
      options.format = args[++i] as any;
      break;
    case '--severity':
      options.severity = args[++i] as any;
      break;
    case '--output':
      options.output = args[++i];
      break;
    case '--report':
      options.report = args[++i] as any;
      break;
    case '--fail-on':
      options.failOnSeverity = args[++i] as any;
      break;
    case '--help':
      console.log(`
Bearer Security Scanning Script

Usage:
  tsx server/scripts/run-bearer-scan.ts [options]

Options:
  --path <path>          Path to scan (default: .)
  --format <format>      Output format: text, json, sarif, html (default: json)
  --severity <level>     Minimum severity: critical, high, medium, low (default: medium)
  --output <file>        Output file path (only for json, sarif, html formats)
  --report <type>        Report type: security, privacy, dataflow
  --fail-on <level>      Fail build on severity: critical, high, medium, low (default: high)
  --help                 Show this help message

Examples:
  # Basic scan with JSON output
  tsx server/scripts/run-bearer-scan.ts

  # Scan specific directory with high severity
  tsx server/scripts/run-bearer-scan.ts --path ./src --severity high

  # Generate privacy report in HTML format
  tsx server/scripts/run-bearer-scan.ts --report privacy --format html --output bearer-report.html

  # Fail CI/CD on critical issues only
  tsx server/scripts/run-bearer-scan.ts --fail-on critical
      `);
      process.exit(0);
  }
}

runBearerScan(options);
