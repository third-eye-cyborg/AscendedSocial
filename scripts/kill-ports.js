#!/usr/bin/env node
/**
 * Kill processes occupying dev server ports before starting.
 * Uses /proc filesystem directly (works in sandboxed environments).
 */
import { readFileSync, readdirSync, readlinkSync } from 'fs';
import { execSync } from 'child_process';

const PORTS = [8080, 3000, 3001];
const myPid = process.pid;

const portHexes = PORTS.map(p => p.toString(16).toUpperCase().padStart(4, '0'));
const pidsToKill = new Set();

try {
  // Read /proc/net/tcp to find LISTENING sockets on our ports
  const tcpData = readFileSync('/proc/net/tcp', 'utf8');
  const targetInodes = new Set();

  for (const line of tcpData.split('\n').slice(1)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 10) continue;
    const [, portHex] = (parts[1] || '').split(':');
    const state = parts[3]; // 0A = LISTEN
    if (portHexes.includes(portHex) && state === '0A') {
      targetInodes.add(parts[9]);
    }
  }

  if (targetInodes.size > 0) {
    // Map inodes to PIDs by scanning /proc/[pid]/fd/
    const procDirs = readdirSync('/proc').filter(f => /^\d+$/.test(f));
    for (const pidStr of procDirs) {
      const pid = parseInt(pidStr);
      if (pid === myPid || pid <= 1) continue;
      try {
        const fds = readdirSync(`/proc/${pidStr}/fd`);
        for (const fd of fds) {
          try {
            const link = readlinkSync(`/proc/${pidStr}/fd/${fd}`);
            if (link.startsWith('socket:[')) {
              const inode = link.slice(8, -1);
              if (targetInodes.has(inode)) {
                pidsToKill.add(pid);
                targetInodes.delete(inode);
              }
            }
          } catch {}
        }
      } catch {}
      if (targetInodes.size === 0) break;
    }
  }
} catch (e) {
  // /proc not available, try ss as fallback
  for (const port of PORTS) {
    try {
      const result = execSync(`ss -tlnp 'sport = :${port}' 2>/dev/null`, { encoding: 'utf8' });
      for (const match of result.matchAll(/pid=(\d+)/g)) {
        const pid = parseInt(match[1]);
        if (pid !== myPid && pid > 1) pidsToKill.add(pid);
      }
    } catch {}
  }
}

if (pidsToKill.size > 0) {
  console.log(`🔄 Killing ${pidsToKill.size} old process(es): PIDs ${[...pidsToKill].join(', ')}`);
  for (const pid of pidsToKill) {
    try { process.kill(pid, 'SIGKILL'); } catch {}
  }
  // Wait for ports to be released
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log('✅ Port cleanup complete');
} else {
  console.log('✅ All ports are free');
}