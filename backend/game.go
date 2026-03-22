package main

type MessageJSON struct {
	Name     string   `json:"name"`
	Position Position `json:"position"`
}

type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// type GameState map[string]Position
