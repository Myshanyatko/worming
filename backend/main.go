package main

import (
	"fmt"
)

func main() {
	fmt.Println("go go  go")
	server := StartServer(messageHandler)

	// for {
	server.WriteMessage([]byte("Hello"))
	// }

	select {}
}

func messageHandler(message []byte) {
	fmt.Println(string(message))
}
