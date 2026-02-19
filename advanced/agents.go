package advanced

import (
	"time"
)

// RepairAgent represents an autonomous self-healing routine
type RepairAgent struct {
	ID      int  `json:"id"`
	Active  bool `json:"active"`
	Targets int  `json:"targets_hit"`
}

// AgentCore manages the lifecycle of repair agents
type AgentCore struct {
	Agents []*RepairAgent
}

var GlobalAgents = &AgentCore{
	Agents: []*RepairAgent{
		{ID: 1, Active: true},
		{ID: 2, Active: true},
		{ID: 3, Active: true},
	},
}

// StartHealingLoop begins the autonomous patrolling
func (ac *AgentCore) StartHealingLoop() {
	go func() {
		for {
			time.Sleep(2 * time.Second)
			_, _, anomaly := GlobalAnomaly.GetStats()

			if anomaly > 50 {
				// Repair Agents activate micro-calibrations
				for _, a := range ac.Agents {
					a.Targets++
					// Calm the anomaly by 5% per agent
					GlobalAnomaly.SetChaos(anomaly * 0.95)
				}
			}
		}
	}()
}

func init() {
	GlobalAgents.StartHealingLoop()
}
