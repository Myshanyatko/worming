package main

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Server struct {
	mu      sync.Mutex
	writeMu sync.Mutex
	clients map[*websocket.Conn]string
}

func StartServer() *Server {
	server := Server{
		clients: make(map[*websocket.Conn]string),
	}

	http.HandleFunc("/", server.echo)
	go http.ListenAndServe(":8080", nil)

	return &server
}

func (server *Server) echo(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		http.Error(w, "Name is required", http.StatusBadRequest)
		return
	}
	connection, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Upgrade failed:", err)
		return
	}
	defer connection.Close()

	server.mu.Lock()
	server.clients[connection] = name
	server.mu.Unlock()
	defer func() {
		server.mu.Lock()
		delete(server.clients, connection)
		server.mu.Unlock()
	}()

	for {
		var pos Position
		if err := connection.ReadJSON(&pos); err != nil {
			fmt.Println("ReadJSON:", err)
			break
		}
		server.WriteMessage(connection, pos, name)
	}
}

func (server *Server) WriteMessage(from *websocket.Conn, position Position, name string) {
	server.mu.Lock()
	targets := make([]*websocket.Conn, 0, len(server.clients))
	for conn := range server.clients {
		if conn != from {
			targets = append(targets, conn)
		}
	}
	server.mu.Unlock()

	message := MessageJSON{Name: name, Position: position}
	server.writeMu.Lock()
	defer server.writeMu.Unlock()
	for _, conn := range targets {
		// fmt.Printf("отправляю", message)
		_ = conn.WriteJSON(message)
	}
}
