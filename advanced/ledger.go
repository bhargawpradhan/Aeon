package advanced

import (
	"sync"
)

// LedgerEntry represents a coordinated state in the Aeon memory
type LedgerEntry struct {
	Value interface{} `json:"value"`
	Term  int         `json:"term"`
}

// DistributedLedger implements a Raft-coordinated KV store
type DistributedLedger struct {
	sync.RWMutex
	data map[string]LedgerEntry
}

var GlobalLedger = &DistributedLedger{
	data: make(map[string]LedgerEntry),
}

// Commit sets a value in the collective memory, coordinated by the cluster leader
func (l *DistributedLedger) Commit(key string, val interface{}) {
	l.Lock()
	defer l.Unlock()

	leader, _ := GlobalCluster.GetLeader()
	term := 0
	if leader != nil {
		term = leader.Term
	}

	l.data[key] = LedgerEntry{
		Value: val,
		Term:  term,
	}
}

// Get retrieves a value from the ledger
func (l *DistributedLedger) Get(key string) (interface{}, bool) {
	l.RLock()
	defer l.RUnlock()
	entry, ok := l.data[key]
	return entry.Value, ok
}

// GetAll returns the entire synchronized state
func (l *DistributedLedger) GetAll() map[string]LedgerEntry {
	l.RLock()
	defer l.RUnlock()

	// Return a copy
	res := make(map[string]LedgerEntry)
	for k, v := range l.data {
		res[k] = v
	}
	return res
}
