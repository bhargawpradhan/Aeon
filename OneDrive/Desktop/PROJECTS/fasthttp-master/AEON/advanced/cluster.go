package advanced

import (
	"sync"
	"time"
)

// NodeRole represents the role of a node in the Raft cluster
type NodeRole string

const (
	Leader    NodeRole = "LEADER"
	Follower  NodeRole = "FOLLOWER"
	Candidate NodeRole = "CANDIDATE"
	Dead      NodeRole = "DEAD"
)

// ClusterNode represents a virtual node in the transcendent cluster
type ClusterNode struct {
	ID        int       `json:"id"`
	Role      NodeRole  `json:"role"`
	Term      int       `json:"term"`
	Votes     int       `json:"votes"`
	Heartbeat time.Time `json:"last_heartbeat"`
}

// ConsensusEngine manages the 5-node virtual cluster
type ConsensusEngine struct {
	sync.RWMutex
	Nodes []*ClusterNode `json:"nodes"`
}

var GlobalCluster = NewConsensusEngine(5)

// NewConsensusEngine initializes a cluster with n nodes
func NewConsensusEngine(n int) *ConsensusEngine {
	e := &ConsensusEngine{
		Nodes: make([]*ClusterNode, n),
	}
	for i := 0; i < n; i++ {
		e.Nodes[i] = &ClusterNode{
			ID:   i,
			Role: Follower,
			Term: 1,
		}
	}
	// Initial election
	e.Nodes[0].Role = Leader
	go e.ElectionLoop()
	return e
}

// ElectionLoop runs the simulated Raft election cycle
func (e *ConsensusEngine) ElectionLoop() {
	ticker := time.NewTicker(500 * time.Millisecond)
	for range ticker.C {
		e.Lock()
		leaderFound := false
		for _, n := range e.Nodes {
			if n.Role == Leader {
				leaderFound = true
				n.Heartbeat = time.Now()
			}
		}

		if !leaderFound {
			// Trigger Election
			candidateIdx := -1
			for i, n := range e.Nodes {
				if n.Role != Dead {
					candidateIdx = i
					break
				}
			}
			if candidateIdx != -1 {
				e.Nodes[candidateIdx].Role = Leader
				e.Nodes[candidateIdx].Term++
			}
		}
		e.Unlock()
	}
}

// FailNode kills a node for resilience testing
func (e *ConsensusEngine) FailNode(id int) {
	e.Lock()
	defer e.Unlock()
	if id >= 0 && id < len(e.Nodes) {
		e.Nodes[id].Role = Dead
	}
}

// RecoverNode brings a node back to life
func (e *ConsensusEngine) RecoverNode(id int) {
	e.Lock()
	defer e.Unlock()
	if id >= 0 && id < len(e.Nodes) {
		e.Nodes[id].Role = Follower
	}
}

// GetLeader returns the current leader node and its term
func (e *ConsensusEngine) GetLeader() (*ClusterNode, int) {
	e.RLock()
	defer e.RUnlock()
	for _, n := range e.Nodes {
		if n.Role == Leader {
			return n, n.Term
		}
	}
	return nil, 0
}

// GetStatus returns the current cluster state
func (e *ConsensusEngine) GetStatus() []*ClusterNode {
	e.RLock()
	defer e.RUnlock()
	return e.Nodes
}

// GetActiveCount returns the number of alive and dead nodes
func (e *ConsensusEngine) GetActiveCount() (int, int) {
	e.RLock()
	defer e.RUnlock()
	alive, dead := 0, 0
	for _, n := range e.Nodes {
		if n.Role == Dead {
			dead++
		} else {
			alive++
		}
	}
	return alive, dead
}
