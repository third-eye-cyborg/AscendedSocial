import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export class ComplianceScanner {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Run privacy compliance scan using static analysis
   * This simulates Privado-style privacy scanning
   */
  async runPrivacyCompliance(): Promise<{
    dataFlows: Array<{
      type: string;
      source: string;
      destination: string;
      dataType: string;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
    violations: Array<{
      rule: string;
      severity: 'warning' | 'error';
      file: string;
      line?: number;
      description: string;
    }>;
    summary: {
      totalDataFlows: number;
      highRiskFlows: number;
      violations: number;
      complianceScore: number;
    };
  }> {
    console.log('🔍 Starting privacy compliance scan...');

    try {
      // Scan common files for privacy-sensitive patterns
      const dataFlows = await this.scanDataFlows();
      const violations = await this.scanPrivacyViolations();

      const highRiskFlows = dataFlows.filter(flow => flow.riskLevel === 'high').length;
      const errorViolations = violations.filter(v => v.severity === 'error').length;
      
      // Calculate compliance score (0-100)
      const complianceScore = Math.max(0, 100 - (highRiskFlows * 15) - (errorViolations * 10));

      return {
        dataFlows,
        violations,
        summary: {
          totalDataFlows: dataFlows.length,
          highRiskFlows,
          violations: violations.length,
          complianceScore
        }
      };
    } catch (error) {
      console.error('Privacy compliance scan failed:', error);
      throw new Error('Privacy compliance scan failed');
    }
  }

  /**
   * Run security vulnerability scan for MCP and general security issues
   */
  async runSecurityScan(): Promise<{
    vulnerabilities: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      file: string;
      line?: number;
      description: string;
      recommendation: string;
    }>;
    securityScore: number;
    categories: {
      authentication: number;
      dataProtection: number;
      inputValidation: number;
      configurationSecurity: number;
    };
  }> {
    console.log('🛡️ Starting security vulnerability scan...');

    try {
      const vulnerabilities = await this.scanSecurityVulnerabilities();
      
      // Calculate category scores
      const categories = this.calculateSecurityCategories(vulnerabilities);
      
      // Calculate overall security score
      const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
      const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
      const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;
      
      const securityScore = Math.max(0, 100 - (criticalCount * 25) - (highCount * 15) - (mediumCount * 5));

      return {
        vulnerabilities,
        securityScore,
        categories
      };
    } catch (error) {
      console.error('Security scan failed:', error);
      throw new Error('Security scan failed');
    }
  }

  private async scanDataFlows() {
    const dataFlows = [];
    
    try {
      // Scan for common data collection patterns
      const files = await this.getJSFiles();
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        
        // Check for email collection
        if (content.includes('email') && (content.includes('input') || content.includes('form'))) {
          dataFlows.push({
            type: 'collection',
            source: file,
            destination: 'database',
            dataType: 'email',
            riskLevel: 'medium' as const
          });
        }
        
        // Check for location data
        if (content.includes('geolocation') || content.includes('getCurrentPosition')) {
          dataFlows.push({
            type: 'collection',
            source: file,
            destination: 'browser_storage',
            dataType: 'location',
            riskLevel: 'high' as const
          });
        }
        
        // Check for analytics tracking
        if (content.includes('posthog') || content.includes('analytics')) {
          dataFlows.push({
            type: 'sharing',
            source: file,
            destination: 'third_party',
            dataType: 'behavioral',
            riskLevel: 'medium' as const
          });
        }
      }
    } catch (error) {
      console.error('Error scanning data flows:', error);
    }
    
    return dataFlows;
  }

  private async scanPrivacyViolations() {
    const violations = [];
    
    try {
      const files = await this.getJSFiles();
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for hardcoded API keys or secrets
          if (line.includes('api_key') && line.includes('=') && !line.includes('process.env')) {
            violations.push({
              rule: 'GDPR_DATA_PROTECTION',
              severity: 'error' as const,
              file,
              line: index + 1,
              description: 'Potential hardcoded API key found'
            });
          }
          
          // Check for missing consent mechanisms
          if (line.includes('cookie') && !content.includes('consent')) {
            violations.push({
              rule: 'GDPR_CONSENT',
              severity: 'warning' as const,
              file,
              line: index + 1,
              description: 'Cookie usage without explicit consent mechanism'
            });
          }
          
          // Check for data retention policies
          if (line.includes('localStorage') || line.includes('sessionStorage')) {
            violations.push({
              rule: 'GDPR_DATA_RETENTION',
              severity: 'warning' as const,
              file,
              line: index + 1,
              description: 'Local storage usage may require data retention policy'
            });
          }
        });
      }
    } catch (error) {
      console.error('Error scanning privacy violations:', error);
    }
    
    return violations;
  }

  private async scanSecurityVulnerabilities() {
    const vulnerabilities = [];
    
    try {
      const files = await this.getJSFiles();
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for SQL injection vulnerabilities
          if (line.includes('query') && line.includes('${') && !line.includes('sanitize')) {
            vulnerabilities.push({
              type: 'SQL_INJECTION',
              severity: 'high' as const,
              file,
              line: index + 1,
              description: 'Potential SQL injection vulnerability',
              recommendation: 'Use parameterized queries or sanitize inputs'
            });
          }
          
          // Check for XSS vulnerabilities
          if (line.includes('innerHTML') && line.includes('${')) {
            vulnerabilities.push({
              type: 'XSS',
              severity: 'high' as const,
              file,
              line: index + 1,
              description: 'Potential XSS vulnerability',
              recommendation: 'Sanitize user input before rendering'
            });
          }
          
          // Check for insecure authentication
          if (line.includes('password') && line.includes('==') && !line.includes('hash')) {
            vulnerabilities.push({
              type: 'WEAK_AUTHENTICATION',
              severity: 'critical' as const,
              file,
              line: index + 1,
              description: 'Password comparison without hashing',
              recommendation: 'Use bcrypt or similar for password hashing'
            });
          }
          
          // Check for insecure HTTP endpoints
          if (line.includes('http://') && !line.includes('localhost')) {
            vulnerabilities.push({
              type: 'INSECURE_TRANSPORT',
              severity: 'medium' as const,
              file,
              line: index + 1,
              description: 'Insecure HTTP connection',
              recommendation: 'Use HTTPS for all external connections'
            });
          }
        });
      }
    } catch (error) {
      console.error('Error scanning security vulnerabilities:', error);
    }
    
    return vulnerabilities;
  }

  private calculateSecurityCategories(vulnerabilities: any[]) {
    const authVulns = vulnerabilities.filter(v => 
      v.type.includes('AUTHENTICATION') || v.type.includes('PASSWORD')
    );
    const dataVulns = vulnerabilities.filter(v => 
      v.type.includes('DATA') || v.type.includes('TRANSPORT')
    );
    const inputVulns = vulnerabilities.filter(v => 
      v.type.includes('INJECTION') || v.type.includes('XSS')
    );
    const configVulns = vulnerabilities.filter(v => 
      v.type.includes('CONFIG') || v.type.includes('SECRET')
    );

    return {
      authentication: Math.max(0, 100 - authVulns.length * 20),
      dataProtection: Math.max(0, 100 - dataVulns.length * 15),
      inputValidation: Math.max(0, 100 - inputVulns.length * 25),
      configurationSecurity: Math.max(0, 100 - configVulns.length * 20)
    };
  }

  private async getJSFiles(): Promise<string[]> {
    const files: string[] = [];
    
    const scanDir = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDir(fullPath);
          } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts') || entry.name.endsWith('.jsx') || entry.name.endsWith('.tsx'))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };
    
    await scanDir(this.projectRoot);
    return files;
  }

  /**
   * Generate compliance report in multiple formats
   */
  async generateComplianceReport(format: 'json' | 'html' = 'json') {
    const [privacyResults, securityResults] = await Promise.all([
      this.runPrivacyCompliance(),
      this.runSecurityScan()
    ]);

    const report = {
      timestamp: new Date().toISOString(),
      project: path.basename(this.projectRoot),
      privacy: privacyResults,
      security: securityResults,
      overallScore: Math.round((privacyResults.summary.complianceScore + securityResults.securityScore) / 2)
    };

    if (format === 'html') {
      return this.generateHTMLReport(report);
    }

    return report;
  }

  private generateHTMLReport(report: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Compliance & Security Report</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
            .score { font-size: 2em; font-weight: bold; margin: 20px 0; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .high-risk { color: #e74c3c; }
            .medium-risk { color: #f39c12; }
            .low-risk { color: #27ae60; }
            .violation { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #e74c3c; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🛡️ Compliance & Security Report</h1>
            <p>Project: ${report.project}</p>
            <p>Generated: ${new Date(report.timestamp).toLocaleDateString()}</p>
            <div class="score">Overall Score: ${report.overallScore}/100</div>
        </div>
        
        <div class="section">
            <h2>📊 Privacy Compliance (Score: ${report.privacy.summary.complianceScore}/100)</h2>
            <p>Data Flows: ${report.privacy.summary.totalDataFlows} (High Risk: ${report.privacy.summary.highRiskFlows})</p>
            <p>Violations: ${report.privacy.summary.violations}</p>
            
            ${report.privacy.violations.map((v: any) => `
                <div class="violation">
                    <strong>${v.rule}</strong> - ${v.severity}
                    <br/>File: ${v.file}${v.line ? ` (Line ${v.line})` : ''}
                    <br/>${v.description}
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>🔒 Security Analysis (Score: ${report.security.securityScore}/100)</h2>
            <p>Vulnerabilities Found: ${report.security.vulnerabilities.length}</p>
            
            ${report.security.vulnerabilities.map((v: any) => `
                <div class="violation">
                    <strong>${v.type}</strong> - ${v.severity}
                    <br/>File: ${v.file}${v.line ? ` (Line ${v.line})` : ''}
                    <br/>${v.description}
                    <br/><em>Recommendation: ${v.recommendation}</em>
                </div>
            `).join('')}
        </div>
    </body>
    </html>
    `;
  }
}