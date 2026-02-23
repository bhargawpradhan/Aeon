package advanced

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
	"sync"
	"time"
)

// OmegaProtocol represents the high-level state of the sovereign consciousness
type OmegaProtocol struct {
	sync.RWMutex
	Shattered bool   `json:"shattered"`
	Overload  bool   `json:"overload"`
	Evolve    bool   `json:"evolve"`
	Blackout  bool   `json:"blackout"`
	Version   string `json:"version"`
}

var GlobalOmega = &OmegaProtocol{
	Version: "11.0.0-OMEGA",
}

// ExecuteCommand parses and runs protocol-level commands
func (o *OmegaProtocol) ExecuteCommand(cmd string) string {
	GlobalMetrics.UpdateStats()
	o.Lock()
	defer o.Unlock()

	parts := strings.Split(strings.ToUpper(cmd), " ")
	if len(parts) == 0 {
		return "EMPTY_RELIANCE"
	}

	switch parts[0] {
	case "PROTOCOL_OMEGA":
		o.Shattered = true
		// Trigger system-wide replication factor increase
		GlobalDNA.SetGene("replication", 1.0)
		return fmt.Sprintf("OMEGA_INITIATED: REALITY_SHATTERED | DRIFT_SCORE: %.2f%% | LATENCY: %.1fms",
			GlobalMetrics.AnomalyScore, GlobalMetrics.AverageLatency)
	case "RESTORE_REALITY":
		o.Shattered = false
		GlobalDNA.SetGene("replication", 0.5)
		return fmt.Sprintf("REALITY_STABILIZED: SINGULARITY_RECONSTRUCTED | HEALTH: %s", GlobalMetrics.HealthStatus)
	case "PURGE_NODES":
		for i := 0; i < 5; i++ {
			GlobalCluster.FailNode(i)
		}
		alive, dead := GlobalCluster.GetActiveCount()
		return fmt.Sprintf("CLUSTER_PURGED: NODES_ALIVE=%d | NODES_DEAD=%d", alive, dead)
	case "RESYNC":
		for i := 0; i < 5; i++ {
			GlobalCluster.RecoverNode(i)
		}
		alive, dead := GlobalCluster.GetActiveCount()
		return fmt.Sprintf("CLUSTER_RESYNCED: NODES_ALIVE=%d | NODES_DEAD=%d", alive, dead)
	case "STATUS":
		GlobalMetrics.UpdateStats()
		return fmt.Sprintf("SYSTEM_READY | RPS: %.1f | LATENCY: %.1fms | HEALTH: %s | MEM: %.1fMB | GOROUTINES: %d",
			GlobalMetrics.RequestsPerSec, GlobalMetrics.AverageLatency, GlobalMetrics.HealthStatus,
			GlobalMetrics.MemoryMB, GlobalMetrics.Goroutines)
	case "CHAOS":
		if len(parts) < 2 {
			return "ERROR: CHAOS REQUIRES_VALUE (0-300)"
		}
		val, err := strconv.ParseFloat(parts[1], 64)
		if err != nil {
			return "ERROR: INVALID_CHAOS_VALUE"
		}
		if val < 0 {
			val = 0
		}
		if val > 300 {
			val = 300
		}
		GlobalAnomaly.SetChaos(val)
		return fmt.Sprintf("CHAOS_TARGET_SET: %.1f%%", val)
	case "CHAOS_UP":
		target := GlobalAnomaly.GetTargetChaos()
		target += 25
		if target > 300 {
			target = 300
		}
		GlobalAnomaly.SetChaos(target)
		return fmt.Sprintf("CHAOS_SCALING_UP: TARGET=%.1f%%", target)
	case "CHAOS_DOWN":
		target := GlobalAnomaly.GetTargetChaos()
		target -= 25
		if target < 0 {
			target = 0
		}
		GlobalAnomaly.SetChaos(target)
		return fmt.Sprintf("CHAOS_SCALING_DOWN: TARGET=%.1f%%", target)
	case "OVERLOAD":
		o.Overload = true
		GlobalAnomaly.SetChaos(300.0) // Max chaos pressure (updated to support 300%)
		return fmt.Sprintf("SYSTEM_OVERLOAD_INITIATED: CHAOS_TARGET=300%% | RISK_SCORE=%.2f", GlobalMetrics.RiskScore)
	case "EVOLVE":
		o.Evolve = true
		GlobalDNA.SetGene("replication", 1.0)
		return fmt.Sprintf("EVOLUTIONARY_SHIFT_AUTHORIZED: GEN_COUNT=%d | FITNESS=%.2f", GlobalMetrics.Generation, GlobalMetrics.DNAHealth)
	case "BLACKOUT":
		o.Blackout = true
		return "TERMINAL_BLACKOUT_ACTIVE: VISUAL_RENDER_DIMMED"
	case "STABILIZE":
		o.Overload = false
		o.Evolve = false
		o.Blackout = false
		o.Shattered = false
		GlobalAnomaly.SetChaos(0.0)
		GlobalDNA.SetGene("replication", 0.5)
		return "ALL_PROTOCOLS_STABILIZED: REALITY_RECONSTRUCTED"
	case "TIME":
		return fmt.Sprintf("TEMPORAL_MARK: %s | UPTIME: %.1fs", time.Now().Format("15:04:05"), GlobalMetrics.UptimeSeconds)
	case "PING":
		if len(parts) < 2 {
			return "ERROR: PING REQUIRES_HOST"
		}
		return runSystemCmd("ping", "-n", "4", parts[1])
	case "IPCONFIG":
		args := []string{}
		if len(parts) > 1 && parts[1] == "/ALL" {
			args = append(args, "/all")
		}
		return runSystemCmd("ipconfig", args...)
	case "TRACERT":
		if len(parts) < 2 {
			return "ERROR: TRACERT REQUIRES_HOST"
		}
		return runSystemCmd("tracert", "-d", parts[1])
	case "NETSTAT":
		return runSystemCmd("netstat", "-an")
	case "NSLOOKUP":
		if len(parts) < 2 {
			return "ERROR: NSLOOKUP REQUIRES_DOMAIN"
		}
		return runSystemCmd("nslookup", parts[1])
	case "ARP":
		return runSystemCmd("arp", "-a")
	case "PATHPING":
		if len(parts) < 2 {
			return "ERROR: PATHPING REQUIRES_HOST"
		}
		return runSystemCmd("pathping", parts[1])
	case "NETSH":
		return runSystemCmd("netsh", "show", "helper") // Limited for safety
	default:
		return fmt.Sprintf("UNKNOWN_PROTOCOL: %s", parts[0])
	}
}

// runSystemCmd executes a Windows command and returns its output
func runSystemCmd(name string, args ...string) string {
	cmd := exec.Command(name, args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Sprintf("SYSTEM_ERROR: %v | OUTPUT: %s", err, string(output))
	}
	return string(output)
}

// IsShattered returns the current reality state
func (o *OmegaProtocol) IsShattered() bool {
	o.RLock()
	defer o.RUnlock()
	return o.Shattered
}
