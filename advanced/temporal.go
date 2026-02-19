package advanced

import (
	"sync"
)

// TemporalSnapshot captures a moment in server time
type TemporalSnapshot struct {
	Timestamp int64         `json:"ts"`
	Metrics   ServerMetrics `json:"metrics"`
}

type ChronalBuffer struct {
	sync.RWMutex
	buffer []TemporalSnapshot
	size   int
	head   int
}

var GlobalTemporal = &ChronalBuffer{
	buffer: make([]TemporalSnapshot, 200),
	size:   200,
}

func (c *ChronalBuffer) Push(metrics ServerMetrics) {
	c.Lock()
	defer c.Unlock()

	snapshot := TemporalSnapshot{
		Timestamp: metrics.lastCheckTime.UnixMilli(),
		Metrics:   metrics,
	}

	c.buffer[c.head] = snapshot
	c.head = (c.head + 1) % c.size
}

func (c *ChronalBuffer) GetHistory() []TemporalSnapshot {
	c.RLock()
	defer c.RUnlock()

	history := make([]TemporalSnapshot, 0, c.size)
	for i := 0; i < c.size; i++ {
		idx := (c.head + i) % c.size
		if c.buffer[idx].Timestamp != 0 {
			history = append(history, c.buffer[idx])
		}
	}
	return history
}
