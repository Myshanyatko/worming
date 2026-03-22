package main

import (
	"fmt"
)

func main() {
	fmt.Println("go go  go")
	StartServer()

	// for {
	// server.WriteMessage( []byte("Hello"))
	// }

	select {}
}
